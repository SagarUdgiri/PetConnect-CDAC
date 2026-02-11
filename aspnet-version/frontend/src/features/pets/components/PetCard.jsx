import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPaw } from 'react-icons/fa';

const PetCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="animate-fadeIn h-100">
      <div className="text-center p-4 h-100 transition-smooth position-relative">
        <div 
          className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-900 border border-4 border-white shadow-sm overflow-hidden" 
          style={{ 
            width: '110px', 
            height: '110px',
            background: '#f8fafc'
          }}
        >
          <img 
            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'} 
            alt={pet.petName}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>

        <h4 className="fw-900 text-slate-900 mb-1">{pet.petName}</h4>
        <p className="text-primary-pet small fw-800 uppercase tracking-wider mb-3" style={{ fontSize: '0.7rem' }}>
          {pet.species} • {pet.age} {pet.age === 1 ? 'Year' : 'Years'}
        </p>
        
        {pet.breed && (
          <div className="bg-white border rounded-pill px-3 py-1 d-inline-block mb-4 shadow-sm" style={{ borderColor: '#f1f5f9 !important' }}>
            <p className="text-slate-500 small fw-700 mb-0">
               <FaPaw size={10} className="me-2 opacity-50" />
               {pet.breed}
            </p>
          </div>
        )}

        <div className="d-flex gap-2 justify-content-center mt-3">
          <Button 
            className="rounded-pill px-4 py-2 fw-800 border-0 shadow-sm d-flex align-items-center gap-2 btn-simple-edit"
            style={{ 
              background: 'white', 
              color: 'var(--brand-primary)',
              fontSize: '0.8rem',
              border: '1px solid #f1f5f9'
            }}
            onClick={() => onEdit(pet)}
          >
            <FaEdit size={12} /> Edit
          </Button>
          <Button 
            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0 btn-simple-delete"
            style={{ 
              width: '38px', 
              height: '38px',
              background: 'white',
              color: '#ef4444',
              border: '1px solid #f1f5f9'
            }}
            onClick={() => onDelete(pet.id)}
          >
            <FaTrash size={12} />
          </Button>
        </div>
      </div>

      <style>{`
        .btn-simple-edit:hover {
          background-color: #f8fafc !important;
          transform: translateY(-2px);
        }
        .btn-simple-delete:hover {
          background-color: #fef2f2 !important;
          transform: translateY(-2px);
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PetCard;
