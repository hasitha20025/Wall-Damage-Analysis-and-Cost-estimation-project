'use client';

import { useState } from 'react';

export default function MaterialForm() {
  const [water, setWater] = useState(13.50);
  const [sand, setSand] = useState(15000);
  const [cement, setCement] = useState(2500);

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      water,
      sand,
      cement,
    };

    console.log('Submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-center">Material Price Input Form</h2>

      <div>
        <label htmlFor="water" className="block mb-1 font-medium text-gray-700">Water Price</label>
        <input
          id="water"
          type='number'
          value={water}
          onChange={(e) => handleNumberInput(e, setWater)}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:secondary"
          placeholder="Enter 1L of water price (Rs)"
          inputMode="numeric"
        />
      </div>

      <div>
        <label htmlFor="sand" className="block mb-1 font-medium text-gray-700">Sand Price</label>
        <input
          id="sand"
          type='number'
          value={sand}
          onChange={(e) => handleNumberInput(e, setSand)}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:secondary"
          placeholder="Enter 1 cubic meters (m³) sand price (Rs) "
          inputMode="numeric"
        />
      </div>

      <div>
        <label htmlFor="cement" className="block mb-1 font-medium text-gray-700">Cement Price</label>
        <input
          id="cement"
          type='number'
          value={cement}
          onChange={(e) => handleNumberInput(e, setCement)}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:secondary"
          placeholder="Enter 50Kg cement bag price (Rs)"
          inputMode="numeric"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-foreground text-white py-2 rounded-md hover:bg-secondary transition"
      >
        Submit
      </button>
    </form>
  );
}
