
import React, { useState, useEffect } from 'react';
import userService from '../src/services/userService';
import { useAuthStore } from '../src/store/authStore';
import { useUIStore } from '../src/store/uiStore';

const SettingsView: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { showSuccess, showError } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    autoRequestApproval: true,
    emailNotifications: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          displayName: data.displayName || '',
          email: data.email || '',
          autoRequestApproval: data.autoApproval ?? true,
          emailNotifications: data.emailNotify ?? false
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        showError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [showError]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        displayName: formData.displayName,
        ...(formData.email && { email: formData.email }),
        autoApproval: formData.autoRequestApproval,
        emailNotify: formData.emailNotifications
      });

      // Update auth store with new user data
      if (user) {
        setUser({
          ...user,
          displayName: updatedUser.displayName,
          email: updatedUser.email
        });
      }

      showSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900">⚙️ Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-bold text-slate-900">Profile & Wallet</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Manage your public identity and connected blockchain wallet.</p>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold">
                {user?.walletAddress ? user.walletAddress.slice(2, 4).toUpperCase() : '??'}
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Display Name</label>
                <input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Connected Wallet</label>
              <div className="flex items-center gap-2 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                <i className="fa-solid fa-wallet text-slate-500"></i>
                <span className="font-mono text-xs flex-1">{user?.walletAddress || 'No wallet connected'}</span>
                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded uppercase font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-2 pt-8">
          <h3 className="font-bold text-slate-900">Escrow Configuration</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Default settings for your smart contract interactions.</p>
        </div>
        <div className="md:col-span-2 space-y-6 pt-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Auto-Request Approval</p>
                <p className="text-xs text-slate-500">Automatically ping client when milestone date passes.</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, autoRequestApproval: !formData.autoRequestApproval })}
                className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-all ${
                  formData.autoRequestApproval ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${
                  formData.autoRequestApproval ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive updates on payment and escrow status.</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-all ${
                  formData.emailNotifications ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${
                  formData.emailNotifications ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
