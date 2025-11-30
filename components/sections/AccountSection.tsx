import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ChevronDown } from 'lucide-react';
import { ACCOUNTS } from '../../constants';
import { PopIn } from '../AnimationWrapper';

const AccountItem = ({ 
  account, 
  isOpen, 
  onToggle 
}: { 
  account: { name: string; relation: string; bank: string; account: string }; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-[#eee] last:border-none">
      <button 
        onClick={onToggle}
        className="w-full py-5 px-4 flex items-center justify-between bg-white hover:bg-[#fdfbf7] transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="font-medium text-[#8b7e74] text-sm w-12 text-left">{account.relation}</span>
          <span className="text-[#3b1e1e] font-medium text-base">{account.name}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-[#beb3a9] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-[#faf9f6]"
          >
            <div className="px-6 py-5 flex items-center justify-between border-t border-[#eee]">
              <div className="text-sm">
                <p className="text-[#8b7e74] mb-1.5 text-xs">{account.bank}</p>
                <p className="text-[#3b1e1e] font-medium tracking-wide text-sm">{account.account}</p>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs transition-all duration-300 shadow-sm ${
                  copied 
                    ? 'bg-[#3b1e1e] text-white border border-[#3b1e1e]' 
                    : 'bg-white text-[#3b1e1e] border border-[#e0dcd9] hover:border-[#3b1e1e]'
                }`}
              >
                <Copy className="w-3 h-3" />
                {copied ? '복사완료' : '복사하기'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AccountSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleTabChange = (tab: 'groom' | 'bride') => {
    setActiveTab(tab);
    setOpenIndex(null); // 탭 변경 시 열린 아코디언 초기화
  };

  const currentAccounts = activeTab === 'groom' ? ACCOUNTS.groom : ACCOUNTS.bride;

  return (
    <section className="py-24 px-6 bg-white">
      <PopIn>
        <h2 className="text-2xl font-serif text-[#3b1e1e] text-left font-bold mb-4 leading-relaxed">
          마음 전하실 곳
        </h2>
        <p className="text-[#8b7e74] text-left text-sm mb-10 font-light leading-relaxed">
          참석이 어려우나 마음전하실 분들을 위해<br />
          계좌번호를 안내해 드립니다.
        </p>

        <div className="max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex mb-6 bg-[#f5f3f0] p-1 rounded-xl">
            <button
              onClick={() => handleTabChange('groom')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'groom'
                  ? 'bg-white text-[#3b1e1e] shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              신랑측
            </button>
            <button
              onClick={() => handleTabChange('bride')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'bride'
                  ? 'bg-white text-[#3b1e1e] shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              신부측
            </button>
          </div>

          {/* Account List */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-[#eee] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
          >
            {currentAccounts.map((account, idx) => (
              <AccountItem
                key={idx}
                account={account}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </motion.div>
        </div>
      </PopIn>
    </section>
  );
};

export default AccountSection;
