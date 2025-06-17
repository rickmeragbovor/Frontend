import React, { useState } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message envoyé :", formData);
    setIsSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <section className="bg-white py-16 px-4 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 max-w-sm mx-auto">
        Contactez-nous
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4 bg-gray-100 p-6 rounded-xl shadow"
      >
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-600">
            Nom
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Votre nom"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-800"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-800"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-600">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Votre message ici..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-800"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition w-full font-medium"
        >
          Envoyer
        </button>

        {isSent && (
          <p className="text-green-600 text-center font-medium mt-2">
            ✅ Message envoyé avec succès !
          </p>
        )}
      </form>
    </section>
  );
};

export default Contact;
