import React from 'react';
import { Link } from 'react-router-dom';

// let it be a functional one, export inline
export default () => {
  return (
      <div>Sintetinis puslapis routinimui patikrinti. Ne kalkuliatorius
          <Link to="/">Atgal į kalkuliatoriaus puslapį</Link>
      </div>
  );
}