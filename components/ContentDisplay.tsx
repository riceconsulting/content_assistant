
import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import ClipboardIcon from './icons/ClipboardIcon';
import MagicWandIcon from './icons/MagicWandIcon';
import ReloadIcon from './icons/ReloadIcon';
import UserIcon from './icons/UserIcon';
import RobotIcon from './icons/RobotIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import { ChatMessage, TopicIdea } from '../types';

interface ContentDisplayProps {
  activeTab: 'content' | 'topic';
  chatHistory: ChatMessage[];
  topicIdeas: TopicIdea[];
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onRefine: (prompt: string) => void;
  onSelectTopic: (headline: string) => void;
}

const ContentPlaceholder: React.FC = () => (
    <div className="text-center text-slate-500">
      <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center">
        <RobotIcon className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-medium text-slate-400">Your content will appear here</h3>
      <p className="mt-1 text-sm">Fill out the form and click "Generate Content" to start.</p>
    </div>
);

const TopicPlaceholder: React.FC = () => (
    <div className="text-center text-slate-500">
      <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center">
        <LightbulbIcon className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-medium text-slate-400">Your topic ideas will appear here</h3>
      <p className="mt-1 text-sm">Fill out the form and click "Generate Ideas" to start.</p>
    </div>
);


const RefinementControls: React.FC<{ onRegenerate: () => void; onRefine: (prompt: string) => void; isLoading: boolean; }> = ({ onRegenerate, onRefine, isLoading }) => {
    const [refinementPrompt, setRefinementPrompt] = useState('');

    const handleRefineClick = () => {
        if (!refinementPrompt.trim() || isLoading) return;
        onRefine(refinementPrompt);
        setRefinementPrompt('');
    };

    const handleRegenerateClick = () => {
        if (isLoading) return;
        onRegenerate();
    }

    return (
        <div className="mt-6 pt-6 border-t border-slate-700/80">
            <label htmlFor="refinement-prompt" className="flex items-center text-md font-semibold text-slate-200 mb-3">
                <MagicWandIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Refine Your Content
            </label>
             <textarea
                id="refinement-prompt"
                name="refinement-prompt"
                rows={3}
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="e.g., Make it more professional, add a call-to-action to sign up, or translate to Spanish..."
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition"
                aria-label="Refinement instructions"
                disabled={isLoading}
            />
            <div className="mt-3 flex justify-end items-center gap-3">
                <button
                    onClick={handleRegenerateClick}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    aria-label="Regenerate content for a new version"
                >
                    <ReloadIcon className="w-4 h-4" />
                    Regenerate
                </button>
                 <button
                    onClick={handleRefineClick}
                    disabled={isLoading || !refinementPrompt.trim()}
                    className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20 text-sm"
                    aria-label="Refine content with the provided instructions"
                >
                    Refine
                </button>
            </div>
        </div>
    );
};

const ChatMessageBubble: React.FC<{ message: ChatMessage; isLoading: boolean; }> = ({ message, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (isUser || !message.content) return;
    const textToCopy = message.hashtags ? `${message.content.trim()}\n\n${message.hashtags.trim()}` : message.content.trim();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = isUser ? UserIcon : RobotIcon;
  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isUser ? 'bg-cyan-900/50' : 'bg-slate-700/60';

  return (
    <div className={`flex items-start gap-3 ${bubbleAlignment}`}>
      {!isUser && <Icon className="w-7 h-7 flex-shrink-0 text-slate-400 mt-2" />}
      <div className={`p-4 rounded-lg max-w-2xl w-fit ${bubbleColor}`}>
        <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
          {isLoading && message.content.length > 0 && <span className="inline-block w-2 h-4 bg-white ml-2 animate-pulse" />}
        </div>
        {!isUser && message.hashtags && (
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <p className="text-cyan-400 font-mono text-sm leading-loose whitespace-pre-wrap">{message.hashtags}</p>
          </div>
        )}
        {!isUser && message.content && !isLoading && (
          <div className="text-right mt-3">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded-md bg-slate-800/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700/60 focus:ring-cyan-500"
              aria-label="Copy message content to clipboard"
            >
              <ClipboardIcon className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
      {isUser && <Icon className="w-7 h-7 flex-shrink-0 text-cyan-400 mt-2" />}
    </div>
  );
};

const TopicIdeaCard: React.FC<{ idea: TopicIdea; onSelect: (headline: string) => void; }> = ({ idea, onSelect }) => (
    <div className="bg-slate-700/60 p-4 rounded-lg border border-slate-600/50 transition-shadow hover:shadow-lg hover:border-slate-500">
        <h4 className="font-semibold text-cyan-400">{idea.headline}</h4>
        <p className="text-slate-300 mt-2 text-sm leading-relaxed">{idea.description}</p>
        <div className="text-right mt-4">
            <button
                onClick={() => onSelect(idea.headline)}
                className="bg-cyan-600/80 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md shadow-cyan-500/10"
                aria-label={`Use topic: ${idea.headline}`}
            >
                Use this Topic
            </button>
        </div>
    </div>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  activeTab, chatHistory, topicIdeas, isLoading, error, onRegenerate, onRefine, onSelectTopic
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, topicIdeas]);

  const hasChatHistory = chatHistory.length > 0;
  const hasTopicIdeas = topicIdeas.length > 0;

  const isInitialLoading = isLoading && !hasChatHistory && !hasTopicIdeas;
  
  const renderContent = () => {
    if (activeTab === 'content') {
        if (!isInitialLoading && !error && !hasChatHistory) {
            return <div className="flex items-center justify-center h-full"><ContentPlaceholder /></div>;
        }
        return (
            <div className="space-y-6">
                {chatHistory.map((message, index) => (
                    <ChatMessageBubble
                        key={index}
                        message={message}
                        isLoading={isLoading && index === chatHistory.length - 1}
                    />
                ))}
            </div>
        );
    }
    
    if (activeTab === 'topic') {
        if (!isInitialLoading && !error && !hasTopicIdeas) {
            return <div className="flex items-center justify-center h-full"><TopicPlaceholder /></div>;
        }
        return (
            <div className="space-y-4">
                {topicIdeas.map((idea, index) => (
                    <TopicIdeaCard key={index} idea={idea} onSelect={onSelectTopic} />
                ))}
            </div>
        );
    }
    return null;
  };

  const getTitle = () => {
    if (activeTab === 'topic') {
        return hasTopicIdeas ? `Generated Topic Ideas (${topicIdeas.length})` : "Topic Ideas";
    }
    return "Conversation";
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col h-full min-h-[400px] lg:min-h-0">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-slate-100">{getTitle()}</h2>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-4 -mr-4 relative custom-scrollbar" role="log">
        {isInitialLoading && !error && (
          <div className="absolute inset-0 bg-slate-800/80 flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <Spinner />
              <p className="mt-2 text-slate-400">{activeTab === 'content' ? 'Generating Content...' : 'Generating Ideas...'}</p>
            </div>
          </div>
        )}
        {error && (
          <div className={`p-4 rounded-md mb-4 ${error.startsWith('Optimizing') ? 'bg-cyan-900/50 border-cyan-700 text-cyan-300' : 'bg-red-900/50 border-red-700 text-red-300'}`} role="alert">
            <h4 className="font-bold">{error.startsWith('Optimizing') ? 'Status' : 'Error'}</h4>
            <p>{error}</p>
          </div>
        )}
        {renderContent()}
      </div>

      {activeTab === 'content' && hasChatHistory && !error && (
        <div className="flex-shrink-0">
            <RefinementControls onRegenerate={onRegenerate} onRefine={onRefine} isLoading={isLoading} />
        </div>
       )}
    </div>
  );
};

export default ContentDisplay;
