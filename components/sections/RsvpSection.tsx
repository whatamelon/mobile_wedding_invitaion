import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Check, X, User, Calendar as CalendarIcon, Users, Utensils, MessageSquare, Save, Loader2, MailOpen } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { PopIn } from '../AnimationWrapper';

interface RsvpData {
  id?: string;
  name: string;
  birthdate: string; // YYYYMMDD
  attendance: 'yes' | 'no' | null;
  meal: 'yes' | 'no' | null;
  companionCount: number;
  message: string;
}

const INITIAL_DATA: RsvpData = {
  name: '',
  birthdate: '',
  attendance: null,
  meal: null,
  companionCount: 0,
  message: ''
};

const InputField = ({ 
  label, 
  children, 
  delay = 0 
}: { 
  label: string; 
  children: React.ReactNode; 
  delay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="mb-6"
  >
    <label className="block text-xs text-[#8b7e74] mb-2 font-medium tracking-wider">{label}</label>
    {children}
  </motion.div>
);

const RsvpSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<RsvpData>(INITIAL_DATA);
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<RsvpData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs for focus management
  const nameRef = useRef<HTMLInputElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);
  const companionRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenModal = (data?: RsvpData) => {
    setFormData(data || INITIAL_DATA);
    setIsModalOpen(true);
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      const q = query(collection(db, 'rsvps'), where('name', '==', searchName.trim()));
      const querySnapshot = await getDocs(q);
      const results: RsvpData[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as RsvpData);
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching documents: ", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_DATA);
    setTimeout(() => {
      const accountSection = document.getElementById('account-section');
      if (accountSection) {
        accountSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300); // Wait for modal close animation
  };

  const handleSave = async () => {
    if (!formData.name || !formData.birthdate || formData.attendance === null || formData.meal === null) {
      alert("필수 항목을 모두 입력해주세요 (이름, 생년월일, 참석여부, 식사여부)");
      return;
    }

    setSubmitLoading(true);
    try {
      const dataToSave = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (formData.id) {
        // Update existing
        const docRef = doc(db, 'rsvps', formData.id);
        await updateDoc(docRef, dataToSave);
        alert("수정되었습니다.");
      } else {
        // Create new
        // Check duplicates strictly before creating (Name + Birthdate)
        const q = query(
          collection(db, 'rsvps'), 
          where('name', '==', formData.name), 
          where('birthdate', '==', formData.birthdate)
        );
        const existingDocs = await getDocs(q);
        
        if (!existingDocs.empty) {
          alert("이미 등록된 정보가 있습니다. 이름으로 검색하여 수정해주세요.");
          setSubmitLoading(false);
          return;
        }

        await addDoc(collection(db, 'rsvps'), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
        alert("소중한 의사 전달 감사합니다.");
      }
      
      setSearchName('');
      setSearchResults([]);
      setHasSearched(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <section className="py-20 px-6 bg-[#fdfbf7]">
      <PopIn>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif text-[#3b1e1e] font-bold mb-3">참석 의사 전달</h2>
          <p className="text-[#8b7e74] text-sm font-light leading-relaxed">
            귀한 발걸음 하시는 분들의<br/>
            편안한 모심을 위해 참석 여부를 알려주세요.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-sm mx-auto mb-12">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="성함을 입력하여 확인하기"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-4 pr-12 py-4 bg-white border border-[#e6e2de] rounded-xl text-[#3b1e1e] placeholder-[#beb3a9] focus:outline-none focus:border-[#3b1e1e] transition-colors"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 p-2 text-[#8b7e74] hover:text-[#3b1e1e] transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* Search Results */}
          <div className="mt-4 space-y-3">
            {hasSearched && searchResults.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-4 bg-white rounded-xl border border-dashed border-[#e6e2de]"
              >
                <p className="text-sm text-[#8b7e74] mb-2">등록된 정보가 없습니다.</p>
                <button
                  onClick={() => handleOpenModal({ ...INITIAL_DATA, name: searchName })}
                  className="text-xs font-bold text-[#3b1e1e] underline underline-offset-4"
                >
                  새로 작성하기
                </button>
              </motion.div>
            )}

            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border border-[#e6e2de] flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3b1e1e]">{result.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      result.attendance === 'yes' 
                        ? 'bg-[#fdfbf7] text-[#3b1e1e] border-[#3b1e1e]' 
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                      {result.attendance === 'yes' ? '참석' : '불참'}
                    </span>
                  </div>
                  <span className="text-xs text-[#beb3a9] mt-1 block">
                    동반 {result.companionCount}명 · 식사 {result.meal === 'yes' ? '예정' : '안함'}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenModal(result)}
                  className="p-2 bg-[#f5f3f0] rounded-lg text-[#3b1e1e] hover:bg-[#ebe8e4] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#3b1e1e] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide shadow-lg active:scale-95 transition-all hover:bg-[#2a1515]"
          >
            참석 의사 전달하기
          </button>
        </div>
      </PopIn>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleCloseModal()}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#eee] flex items-center justify-between bg-[#fdfbf7]">
                <h3 className="text-lg font-serif font-bold text-[#3b1e1e]">참석 정보 입력</h3>
                <button 
                  onClick={() => handleCloseModal()}
                  className="text-[#beb3a9] hover:text-[#3b1e1e] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 pb-8">
                <InputField label="성함" delay={0.1}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#beb3a9]" />
                    <input
                      ref={nameRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onKeyDown={(e) => handleKeyDown(e, birthRef)}
                      placeholder="성함을 입력해주세요"
                      className="w-full pl-10 pr-4 py-3 bg-[#f9f9f9] rounded-lg text-[#3b1e1e] text-sm focus:outline-none focus:ring-1 focus:ring-[#3b1e1e] transition-all"
                    />
                  </div>
                </InputField>

                <InputField label="생년월일 6자리 (본인 확인용)" delay={0.2}>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#beb3a9]" />
                    <input
                      ref={birthRef}
                      type="text"
                      maxLength={6}
                      value={formData.birthdate}
                      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="예) 900101"
                      className="w-full pl-10 pr-4 py-3 bg-[#f9f9f9] rounded-lg text-[#3b1e1e] text-sm focus:outline-none focus:ring-1 focus:ring-[#3b1e1e] transition-all tracking-widest"
                    />
                  </div>
                </InputField>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <InputField label="참석 여부" delay={0.3}>
                    <div className="flex gap-2">
                      {['yes', 'no'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, attendance: option as 'yes' | 'no' })}
                          className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                            formData.attendance === option
                              ? 'bg-[#3b1e1e] text-white shadow-md transform scale-[1.02]'
                              : 'bg-[#f9f9f9] text-[#8b7e74] hover:bg-[#eee]'
                          }`}
                        >
                          {option === 'yes' ? '참석' : '불참'}
                        </button>
                      ))}
                    </div>
                  </InputField>

                  <InputField label="식사 여부" delay={0.4}>
                    <div className="flex gap-2">
                      {['yes', 'no'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, meal: option as 'yes' | 'no' })}
                          className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                            formData.meal === option
                              ? 'bg-[#3b1e1e] text-white shadow-md transform scale-[1.02]'
                              : 'bg-[#f9f9f9] text-[#8b7e74] hover:bg-[#eee]'
                          }`}
                        >
                          {option === 'yes' ? '예정' : '안함'}
                        </button>
                      ))}
                    </div>
                  </InputField>
                </div>

                <InputField label="동반 인원 (본인 제외)" delay={0.5}>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#beb3a9]" />
                    <input
                      ref={companionRef}
                      type="number"
                      min={0}
                      value={formData.companionCount}
                      onChange={(e) => setFormData({ ...formData, companionCount: parseInt(e.target.value) || 0 })}
                      onKeyDown={(e) => handleKeyDown(e, messageRef)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f9f9f9] rounded-lg text-[#3b1e1e] text-sm focus:outline-none focus:ring-1 focus:ring-[#3b1e1e] transition-all"
                    />
                  </div>
                </InputField>

                <InputField label="축하의 한마디" delay={0.6}>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-[#beb3a9]" />
                    <textarea
                      ref={messageRef}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="신랑 신부에게 축하의 마음을 전해주세요."
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-[#f9f9f9] rounded-lg text-[#3b1e1e] text-sm focus:outline-none focus:ring-1 focus:ring-[#3b1e1e] transition-all resize-none"
                    />
                  </div>
                </InputField>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={handleSave}
                  disabled={submitLoading}
                  className="w-full bg-[#fb7185] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-[#f43f5e] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                >
                  {submitLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <MailOpen className="w-4 h-4" />
                      마음 전달하기
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RsvpSection;

