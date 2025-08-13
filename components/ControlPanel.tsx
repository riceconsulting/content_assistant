import React from 'react';
import Dropdown from './Dropdown';
import Spinner from './Spinner';
import PlatformIcon from './icons/PlatformIcon';
import ToneIcon from './icons/ToneIcon';
import WordCountIcon from './icons/WordCountIcon';
import HashtagIcon from './icons/HashtagIcon';
import PersonaIcon from './icons/PersonaIcon';
import PromotionIcon from './icons/PromotionIcon';
import { ContentPreferences } from '../types';
import { PLATFORM_OPTIONS, TONE_OPTIONS, WORD_COUNT_OPTIONS, PERSONA_OPTIONS, PROMOTION_LEVEL_OPTIONS } from '../constants';

interface ControlPanelProps {
  preferences: ContentPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<ContentPreferences>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ preferences, setPreferences, onGenerate, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-6 h-full">
      <h2 className="text-xl font-semibold text-slate-100">Customize Your Content</h2>
      
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
          What is your topic?
        </label>
        <textarea
          id="topic"
          name="topic"
          rows={3}
          value={preferences.topic}
          onChange={handleInputChange}
          placeholder="e.g., The benefits of remote work for startups"
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition"
          aria-label="Content topic"
        />
      </div>

      <Dropdown
        label="Platform"
        icon={<PlatformIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.platform}
        onChange={(e) => setPreferences(prev => ({ ...prev, platform: e.target.value }))}
        options={PLATFORM_OPTIONS}
      />

      <Dropdown
        label="Tone of Voice"
        icon={<ToneIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.tone}
        onChange={(e) => setPreferences(prev => ({ ...prev, tone: e.target.value }))}
        options={TONE_OPTIONS}
      />

      <Dropdown
        label="Word Count"
        icon={<WordCountIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.wordCount}
        onChange={(e) => setPreferences(prev => ({ ...prev, wordCount: e.target.value }))}
        options={WORD_COUNT_OPTIONS}
      />

      <Dropdown
        label="Writer Persona"
        icon={<PersonaIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.writerPersona}
        onChange={(e) => setPreferences(prev => ({ ...prev, writerPersona: e.target.value }))}
        options={PERSONA_OPTIONS}
      />
      
      <div>
        <label htmlFor="creatorName" className="block text-sm font-medium text-slate-300 mb-2">
          Your Name/Brand (for promotion)
        </label>
        <input
          type="text"
          id="creatorName"
          name="creatorName"
          value={preferences.creatorName}
          onChange={handleInputChange}
          placeholder="e.g., Jane Doe Inc."
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition"
          aria-label="Creator or brand name"
        />
      </div>

      <Dropdown
        label="Self-Promotion Level"
        icon={<PromotionIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.promotionLevel}
        onChange={(e) => setPreferences(prev => ({ ...prev, promotionLevel: e.target.value }))}
        options={PROMOTION_LEVEL_OPTIONS}
      />

      <div>
        <label htmlFor="customNotes" className="block text-sm font-medium text-slate-300 mb-2">
          Additional Notes for AI
        </label>
        <textarea
          id="customNotes"
          name="customNotes"
          rows={3}
          value={preferences.customNotes}
          onChange={handleInputChange}
          placeholder="e.g., Add a call-to-action to visit my website."
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition"
          aria-label="Custom notes for AI"
        />
      </div>
      
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="generateHashtags"
            name="generateHashtags"
            type="checkbox"
            checked={preferences.generateHashtags}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-cyan-600 focus:ring-cyan-600 transition"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="generateHashtags" className="font-medium text-slate-300 flex items-center cursor-pointer">
            <HashtagIcon className="w-5 h-5 text-slate-400 mr-2" />
            Suggest hashtags
          </label>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || !preferences.topic.trim()}
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20"
          aria-label="Generate content based on selected preferences"
        >
          {isLoading ? <Spinner /> : 'Generate Content'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
