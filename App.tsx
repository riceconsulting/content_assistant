
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ControlPanel from './components/ControlPanel';
import TopicPanel from './components/TopicPanel';
import ContentDisplay from './components/ContentDisplay';
import { ContentPreferences, ChatMessage, TopicPreferences, TopicIdea } from './types';
import { PLATFORM_OPTIONS, TONE_OPTIONS, WORD_COUNT_OPTIONS, PERSONA_OPTIONS, PROMOTION_LEVEL_OPTIONS, AUDIENCE_OPTIONS, CONTENT_ANGLE_OPTIONS, HOOK_STYLE_OPTIONS, NUM_IDEAS_OPTIONS } from './constants';
import { ai } from './services/geminiService';
import { Chat, Type } from '@google/genai';

type AppTab = 'content' | 'topic';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('content');

  // Content Generation State
  const [contentPreferences, setContentPreferences] = useState<ContentPreferences>({
    topic: '',
    platform: PLATFORM_OPTIONS[0].value,
    tone: TONE_OPTIONS[0].value,
    wordCount: WORD_COUNT_OPTIONS[0].value,
    generateHashtags: false,
    writerPersona: PERSONA_OPTIONS[0].value,
    promotionLevel: PROMOTION_LEVEL_OPTIONS[0].value,
    creatorName: '',
    customNotes: '',
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatRef = useRef<Chat | null>(null);

  // Topic Generation State
  const [topicPreferences, setTopicPreferences] = useState<TopicPreferences>({
    industry: '',
    audience: AUDIENCE_OPTIONS[0].value,
    angle: CONTENT_ANGLE_OPTIONS[0].value,
    hook: HOOK_STYLE_OPTIONS[0].value,
    numIdeas: NUM_IDEAS_OPTIONS[0].value,
  });
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([]);

  // General State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const processNewMessageStream = async (stream: AsyncGenerator<any, any, any>) => {
    let fullResponseText = '';
    const separator = '---HASHTAGS---';
    
    setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

    for await (const chunk of stream) {
      fullResponseText += chunk.text;
      
      let contentPart = fullResponseText;
      let hashtagPart = '';
      const separatorIndex = fullResponseText.indexOf(separator);

      if (separatorIndex !== -1) {
        contentPart = fullResponseText.substring(0, separatorIndex);
        hashtagPart = fullResponseText.substring(separatorIndex + separator.length).trim();
      }
      
      setChatHistory(prev => {
          const newHistory = [...prev];
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage?.role === 'model') {
              lastMessage.content = contentPart;
              lastMessage.hashtags = hashtagPart;
          }
          return newHistory;
      });
    }
  };

  const handleGenerateContent = useCallback(async () => {
    if (!contentPreferences.topic.trim()) {
      setError("Please enter a topic to generate content.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setChatHistory([]);
    setTopicIdeas([]); // Clear topic ideas when generating content
    chatRef.current = null;
    
    try {
      const { topic, platform, tone, wordCount, generateHashtags, writerPersona, promotionLevel, creatorName, customNotes } = contentPreferences;
      
      setError('Optimizing prompt for best results...');
      
      const metaPromptGeneratorPrompt = `Based on the following user preferences, create a single, cohesive, and detailed prompt for a generative AI to write high-quality content. The output should be ONLY the prompt itself, without any explanation, titles, or pleasantries.
      ---
      **User Preferences:**
      - **Content Topic:** "${topic}"
      - **Target Platform:** ${platform}
      - **Desired Tone of Voice:** ${tone}
      - **Approximate Word Count:** ${wordCount} words
      - **Writer Persona:** Act as a ${writerPersona}.
      - **Creator/Brand Name (for promotion):** ${creatorName || 'Not provided'}
      - **Self-Promotion Level:** ${promotionLevel}% of the content should be dedicated to promoting the creator. If 0%, do not mention them.
      - **Include Hashtags:** ${generateHashtags ? 'Yes, provide 10-15 relevant hashtags.' : 'No.'}
      - **Additional Instructions from User:** ${customNotes || 'None'}
      ---
      Now, generate the optimized prompt for the AI content writer.`;

      const metaPromptResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: metaPromptGeneratorPrompt,
          config: {
              systemInstruction: 'You are an expert in prompt engineering. Your task is to craft the best possible prompt for another AI based on user requirements. Your output must be only the prompt text.'
          }
      });
      const optimizedPrompt = metaPromptResponse.text;
      setError(null);

      let userDisplayPrompt = `Generate a piece of content for me.\n- Platform: ${platform}\n- Topic: ${topic}\n- Tone: ${tone}\n- Word Count: ~${wordCount} words\n- Persona: ${writerPersona}`;
      if (creatorName.trim()) userDisplayPrompt += `\n- My Name/Brand: ${creatorName}`;
      userDisplayPrompt += `\n- Promotion Level: ${promotionLevel}%`;
      if (customNotes.trim()) userDisplayPrompt += `\n- Notes: ${customNotes}`;
      if (generateHashtags) userDisplayPrompt += '\n- Include Hashtags';
      
      setChatHistory([
        { role: 'user', content: userDisplayPrompt.trim() },
        { role: 'model', content: '' }
      ]);

      const separator = '---HASHTAGS---';
      let systemInstruction = `You are an expert content creator and social media strategist. Your task is to generate a piece of content based on the user's specifications. You will adopt the persona of a ${writerPersona}. Provide only the content itself (and hashtags if requested), without any of your own commentary, introduction, or sign-off.`;
      if (generateHashtags) {
        systemInstruction += ` After the main content, add a separator '${separator}' on a new line. After the separator, provide a list of 10-15 relevant hashtags, each starting with # and separated by spaces.`;
      }
      
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction }
      });
      chatRef.current = newChat;

      const totalWords = parseInt(wordCount, 10);
      const maxWordsPerChunk = 1000;
      const numChunks = Math.max(1, Math.ceil(totalWords / maxWordsPerChunk));
      let fullContentSoFar = "";

      for (let i = 0; i < numChunks; i++) {
        const isFirstChunk = i === 0;
        const isLastChunk = i === numChunks - 1;
        let chunkPrompt = '';

        if (isFirstChunk) {
          chunkPrompt = optimizedPrompt;
          if (numChunks > 1) {
            chunkPrompt += `\n\nThis content will be long, so this is just the first part. Please write the beginning of the content, up to ${maxWordsPerChunk} words. Do not write a conclusion. I will ask you to continue in the next prompt.`;
          }
        } else {
          chunkPrompt = `Excellent, please continue writing based on the original request. Here is what has been written so far:\n\n---\n${fullContentSoFar.trim()}\n---\n\nPlease provide the next section of the content, ensuring a seamless transition. Do not repeat what you've already written.`;
          if (isLastChunk) {
            chunkPrompt += ` This is the final part, so please write a conclusion.`;
          }
        }
        
        const stream = await newChat.sendMessageStream({ message: chunkPrompt });
        
        let chunkResponseText = '';
        for await (const chunk of stream) {
            const text = chunk.text;
            chunkResponseText += text;
            
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage?.role === 'model') {
                    const combinedText = fullContentSoFar + chunkResponseText;
                    let contentPart = combinedText;
                    let hashtagPart = '';
                    const separatorIndex = combinedText.indexOf(separator);
                    
                    if (separatorIndex !== -1) {
                        contentPart = combinedText.substring(0, separatorIndex);
                        hashtagPart = combinedText.substring(separatorIndex + separator.length).trim();
                    }
                    lastMessage.content = contentPart;
                    lastMessage.hashtags = hashtagPart;
                }
                return newHistory;
            });
        }
        fullContentSoFar += chunkResponseText.split(separator)[0] + "\n\n";
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`Failed to generate content. ${errorMessage}`);
      chatRef.current = null;
    } finally {
      setIsLoading(false);
      // Do not clear the error message if it was for prompt optimization, so the user can see it
      if (!error?.startsWith('Optimizing')) {
        setError(null);
      }
    }
  }, [contentPreferences, error]);

  const handleRegenerateContent = useCallback(async () => {
    await handleGenerateContent();
  }, [handleGenerateContent]);

  const handleRefineContent = useCallback(async (refinementPrompt: string) => {
    if (!chatRef.current || !refinementPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
        setChatHistory(prev => [...prev, { role: 'user', content: refinementPrompt }]);
        const stream = await chatRef.current.sendMessageStream({ message: refinementPrompt });
        await processNewMessageStream(stream);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        console.error(e);
        setError(`Failed to refine content. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleGenerateTopics = useCallback(async () => {
    if (!topicPreferences.industry.trim()) {
        setError("Please enter an industry or niche.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setTopicIdeas([]);
    setChatHistory([]); // Clear chat history when generating topics

    try {
        const { industry, audience, angle, hook, numIdeas } = topicPreferences;
        const prompt = `You are a creative content strategist and marketing expert. Your task is to generate ${numIdeas} content topic ideas for a specific niche. For each idea, provide a compelling, click-worthy headline and a short 1-2 sentence description explaining the topic.

        **Instructions:**
        - **Industry/Niche:** ${industry}
        - **Target Audience:** ${audience}
        - **Content Angle:** ${angle}
        - **Engagement Hook:** ${hook}
        - **Output Format:** You must provide your response as a JSON array, where each object has two keys: "headline" and "description". Do not include any other text or markdown formatting.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            headline: {
                                type: Type.STRING,
                                description: "The compelling, click-worthy headline for the content idea."
                            },
                            description: {
                                type: Type.STRING,
                                description: "A brief, 1-2 sentence summary of what the content would be about."
                            }
                        },
                        required: ["headline", "description"]
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const ideas = JSON.parse(jsonText);
        setTopicIdeas(ideas);

    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        console.error(e);
        setError(`Failed to generate topic ideas. ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [topicPreferences]);

  const handleSelectTopic = (headline: string) => {
    const { industry, audience, angle, hook } = topicPreferences;
    
    // Create a formatted string with the context from the topic generation.
    // This will be added to the "Additional Notes" section.
    const topicContextNotes = `Context from Topic Idea Generation:
- Industry/Niche: ${industry}
- Target Audience: ${audience}
- Content Angle: ${angle}
- Engagement Hook Style: ${hook}`;

    setContentPreferences(prev => {
      // If there are already custom notes, append the new context.
      // Otherwise, just use the new context.
      const newCustomNotes = prev.customNotes
        ? `${prev.customNotes}\n\n${topicContextNotes}`
        : topicContextNotes;

      return {
        ...prev,
        topic: headline,
        customNotes: newCustomNotes
      };
    });
    
    // Switch to the content generator tab
    setActiveTab('content');
    
    // Clean up state for the new workflow
    setTopicIdeas([]);
    setChatHistory([]);
  };
  
  const TabButton: React.FC<{ tabId: AppTab; label: string; }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
      }`}
      aria-current={activeTab === tabId ? 'page' : undefined}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="mb-6 flex justify-center space-x-2 p-1 bg-slate-800/80 rounded-lg">
            <TabButton tabId="content" label="Content Generator" />
            <TabButton tabId="topic" label="Topic Idea Generator" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-4">
            {activeTab === 'content' ? (
                <ControlPanel
                    preferences={contentPreferences}
                    setPreferences={setContentPreferences}
                    onGenerate={handleGenerateContent}
                    isLoading={isLoading}
                />
            ) : (
                <TopicPanel
                    preferences={topicPreferences}
                    setPreferences={setTopicPreferences}
                    onGenerate={handleGenerateTopics}
                    isLoading={isLoading}
                />
            )}
          </div>
          <div className="lg:col-span-8">
            <ContentDisplay
              activeTab={activeTab}
              chatHistory={chatHistory}
              topicIdeas={topicIdeas}
              onSelectTopic={handleSelectTopic}
              isLoading={isLoading}
              error={error}
              onRegenerate={handleRegenerateContent}
              onRefine={handleRefineContent}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
