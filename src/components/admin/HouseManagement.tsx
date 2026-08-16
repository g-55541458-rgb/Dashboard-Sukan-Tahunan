import React, { useState } from 'react';
import { SportsHouse } from '../../types';
import { Shield, Plus, Edit2, Trash2, Save, X, RotateCcw, AlertTriangle } from 'lucide-react';

interface HouseManagementProps {
  houses: SportsHouse[];
  onUpdateHouses: (houses: SportsHouse[]) => void;
}

export const HouseManagement: React.FC<HouseManagementProps> = ({ houses, onUpdateHouses }) => {
  const [editingHouse, setEditingHouse] = useState<SportsHouse | null>(null);
  const [deletingHouse, setDeletingHouse] = useState<SportsHouse | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<SportsHouse>>({
    name: '',
    mascot: '',
    color: '#3b82f6',
    iconName: 'Flame',
    leaderName: '',
    baselinePoints: 0,
    penaltyPoints: 0,
  });

  const handleEdit = (house: SportsHouse) => {
    setEditingHouse(house);
    setFormData(house);
    setIsNew(false);
  };

  const handleAddNew = () => {
    const newHouse: SportsHouse = {
      id: `house-${Date.now()}`,
      name: 'Rumah Ungu',
      mascot: 'Serigala Ungu',
      color: '#a855f7',
      iconName: 'Flame',
      leaderName: 'Cikgu Lee',
      baselinePoints: 0,
      penaltyPoints: 0,
    };
    setEditingHouse(newHouse);
    setFormData(newHouse);
    setIsNew(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (isNew) {
      const updated = [...houses, formData as SportsHouse];
      onUpdateHouses(updated);
    } else {
      const updated = houses.map((h) => (h.id === editingHouse?.id ? ({ ...h, ...formData } as SportsHouse) : h));
      onUpdateHouses(updated);
    }

    setEditingHouse(null);
  };

  const confirmDelete = () => {
    if (!deletingHouse) return;
    const targetId = deletingHouse.id;
    const updated = houses.filter((h) => h.id !== targetId);
    onUpdateHouses(updated);

    if (editingHouse?.id === targetId) {
      setEditingHouse(null);
    }
    setDeletingHouse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Pengurusan Rumah Sukan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kemaskini warna identiti, maskot, ketua rumah, dan penalti/bonus mata awal.
          </p>
        </div>

        <button
          id="btn-add-house"
          onClick={handleAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rumah Sukan</span>
        </button>
      </div>

      {/* Houses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {houses.map((house) => (
          <div
            key={house.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                  style={{ backgroundColor: house.color }}
                >
                  {house.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800" style={{ color: house.color }}>
                    {house.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">{house.mascot}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ketua: <span className="text-slate-700 font-medium">{house.leaderName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(house)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1"
                  title="Edit Rumah Sukan"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingHouse(house)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center space-x-1"
                  title="Padam Rumah Sukan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam</span>
                </button>
              </div>
            </div>

            {/* Points Baseline & Penalty */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>
                Baseline Mata Awal: <span className="font-bold text-emerald-600">+{house.baselinePoints}</span>
              </div>
              <div>
                Penalti Mata: <span className="font-bold text-red-600">-{house.penaltyPoints}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingHouse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-base">
                {isNew ? 'Tambah Rumah Sukan Baharu' : `Kemaskini ${editingHouse.name}`}
              </h3>
              <button onClick={() => setEditingHouse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nama Rumah Sukan</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Rumah Merah"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Maskot / Gelaran</label>
                <input
                  type="text"
                  value={formData.mascot || ''}
                  onChange={(e) => setFormData({ ...formData, mascot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Naga Merah"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Warna Identiti (Hex)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.color || '#3b82f6'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={formData.color || ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Ketua Rumah Sukan</label>
                <input
                  type="text"
                  value={formData.leaderName || ''}
                  onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Cikgu Lee"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Baseline Mata (+)</label>
                  <input
                    type="number"
                    value={formData.baselinePoints ?? 0}
                    onChange={(e) => setFormData({ ...formData, baselinePoints: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Penalti Mata (-)</label>
                  <input
                    type="number"
                    value={formData.penaltyPoints ?? 0}
                    onChange={(e) => setFormData({ ...formData, penaltyPoints: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              {!isNew && editingHouse ? (
                <button
                  type="button"
                  onClick={() => setDeletingHouse(editingHouse)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam Rumah Sukan</span>
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingHouse(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingHouse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Padam Rumah Sukan</h3>
                <p className="text-xs text-slate-500 font-semibold">{deletingHouse.name} ({deletingHouse.mascot})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adakah anda pasti mahu memadam <strong>{deletingHouse.name}</strong>? Tindakan ini akan mengemas kini statistik dan senarai rumah sukan serta-merta.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingHouse(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Padam Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
