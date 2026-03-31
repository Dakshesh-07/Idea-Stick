import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsView() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-900/5 mt-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">⚙️</span>
        </div>
        <h2 className="text-2xl font-headline font-bold text-slate-800 text-center mb-2">Account Settings</h2>
        <p className="text-slate-500 text-center max-w-sm">Please sign in to manage your profile identity, avatars, and configuration.</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(name, avatar);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-headline font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your identity and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
         <form onSubmit={handleSave} className="p-8 space-y-6">
            <h3 className="font-headline font-bold text-lg border-b border-slate-100 pb-2">Profile Information</h3>
            
            <div className="flex gap-6 items-center">
              <img 
                src={avatar || `https://ui-avatars.com/api/?name=${name}`} 
                className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover"
                alt="Avatar"
              />
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avatar Image URL</label>
                <input 
                  type="text"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Display Name</label>
              <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none font-semibold transition-all"
              />
            </div>

            <div className="pt-4 flex justify-end">
               <button 
                 type="submit" 
                 disabled={isSaving}
                 className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
               >
                 {isSaving ? "Saving..." : <><Save className="w-5 h-5"/> Save Changes</>}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}
