import React, { useState } from "react";

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 👉 Simule un envoi
    console.log("Message envoyé :", formData);

    setIsSent(true);
    setFormData({ name: "", email: "", message: "" });

    // Cache le message après 4 secondes
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <section className="bg-white py-16 px-6 lg:px-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
        Contactez-nous
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto space-y-6 bg-gray-50 p-6 rounded-xl shadow"
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-300"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-300"
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-300"
            placeholder="Votre message ici..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition w-full"
        >
          Envoyer le message
        </button>

        {isSent && (
          <p className="text-green-600 text-center font-semibold mt-4">
            ✅ Message envoyé avec succès !
          </p>
        )}
      </form>
    </section>
  );
};

export default Contact;
