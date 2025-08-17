import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpotifyPanel(): null {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/music', { replace: true });
  }, [navigate]);
  return null;
}