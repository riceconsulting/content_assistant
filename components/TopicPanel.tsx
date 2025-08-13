
import React from 'react';
import Dropdown from './Dropdown';
import Spinner from './Spinner';
import LightbulbIcon from './icons/LightbulbIcon';
import AudienceIcon from './icons/AudienceIcon';
import AngleIcon from './icons/AngleIcon';
import HookIcon from './icons/HookIcon';
import { TopicPreferences } from '../types';
import { AUDIENCE_OPTIONS, CONTENT_ANGLE_OPTIONS, HOOK_STYLE_OPTIONS, NUM_IDEAS_OPTIONS } from '../constants';

interface TopicPanelProps {
  preferences: TopicPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<TopicPreferences>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const TopicPanel: React.FC<TopicPanelProps> = ({ preferences, setPreferences, onGenerate, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-6 h-full">
      <h2 className="text-xl font-semibold text-slate-100">Generate Topic Ideas</h2>
      
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
          What is your Industry or Niche?
        </label>
        <input
          id="industry"
          name="industry"
          type="text"
          value={preferences.industry}
          onChange={handleInputChange}
          placeholder="e.g., SaaS, Home Gardening, Fitness"
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition"
          aria-label="Industry or Niche"
        />
      </div>

      <Dropdown
        label="Target Audience"
        icon={<AudienceIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.audience}
        onChange={(e) => setPreferences(prev => ({ ...prev, audience: e.target.value }))}
        options={AUDIENCE_OPTIONS}
      />

      <Dropdown
        label="Content Angle"
        icon={<AngleIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.angle}
        onChange={(e) => setPreferences(prev => ({ ...prev, angle: e.target.value }))}
        options={CONTENT_ANGLE_OPTIONS}
      />

      <Dropdown
        label="Engagement Hook"
        icon={<HookIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.hook}
        onChange={(e) => setPreferences(prev => ({ ...prev, hook: e.target.value }))}
        options={HOOK_STYLE_OPTIONS}
      />

      <Dropdown
        label="Number of Ideas"
        icon={<LightbulbIcon className="w-5 h-5 text-slate-400" />}
        value={preferences.numIdeas}
        onChange={(e) => setPreferences(prev => ({ ...prev, numIdeas: e.target.value }))}
        options={NUM_IDEAS_OPTIONS}
      />
      
      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || !preferences.industry.trim()}
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20"
          aria-label="Generate topic ideas based on selected preferences"
        >
          {isLoading ? <Spinner /> : 'Generate Ideas'}
        </button>
      </div>
    </div>
  );
};

export default TopicPanel;
