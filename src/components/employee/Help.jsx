import { useState } from "react";

function Help() {
  const [activeCategory, setActiveCategory] = useState("faq");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    description: "",
  });

  const faqItems = [
    {
      id: 1,
      question: "How do I request a new asset?",
      answer:
        'Go to the "My Requests" section and click on "Request New Asset". Fill out the form with the asset details and submit.',
    },
    {
      id: 2,
      question: "How do I return an asset?",
      answer:
        'Navigate to "My Assets", select the asset you want to return, and click the "Return Asset" button. Provide a reason for the return.',
    },
    {
      id: 3,
      question: "How long does it take to approve a request?",
      answer:
        "Asset requests are typically reviewed within 2-3 business days. High-priority requests may be processed faster.",
    },
    {
      id: 4,
      question: "Can I track my asset requests?",
      answer:
        'Yes, go to "My Requests" to see all your requests and their current status (Pending, Approved, Rejected).',
    },
    {
      id: 5,
      question: "What should I do if my asset is damaged?",
      answer:
        "Report the damage immediately through the Help & Support section. Create a support ticket with details about the damage.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    // Submit ticket logic here
    alert("Support ticket submitted successfully!");
    setTicketForm({
      subject: "",
      category: "technical",
      priority: "medium",
      description: "",
    });
  };

  return (
    <>
      <section className="section-header">
        <h2>Help & Support</h2>
      </section>

      {/* Category Tabs */}
      <section className="help-tabs">
        <button
          className={`tab-btn ${activeCategory === "faq" ? "active" : ""}`}
          onClick={() => setActiveCategory("faq")}
        >
          FAQ
        </button>
        <button
          className={`tab-btn ${activeCategory === "contact" ? "active" : ""}`}
          onClick={() => setActiveCategory("contact")}
        >
          Contact Support
        </button>
        <button
          className={`tab-btn ${activeCategory === "guides" ? "active" : ""}`}
          onClick={() => setActiveCategory("guides")}
        >
          User Guides
        </button>
      </section>

      {/* FAQ Section */}
      {activeCategory === "faq" && (
        <section className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqItems.map((item) => (
              <div key={item.id} className="faq-item">
                <h4 className="faq-question">{item.question}</h4>
                <p className="faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Support Section */}
      {activeCategory === "contact" && (
        <section className="contact-section">
          <div className="form-card">
            <h3>Submit a Support Ticket</h3>
            <form onSubmit={handleSubmitTicket}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    value={ticketForm.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={ticketForm.category}
                    onChange={handleInputChange}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="asset">Asset Related</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={ticketForm.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={ticketForm.description}
                  onChange={handleInputChange}
                  placeholder="Please provide detailed information about your issue..."
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="action-btn primary">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* User Guides Section */}
      {activeCategory === "guides" && (
        <section className="guides-section">
          <h3>User Guides</h3>
          <div className="guides-grid">
            <div className="guide-card">
              <div className="guide-icon">📖</div>
              <h4>Getting Started</h4>
              <p>Learn the basics of using the employee portal</p>
              <button className="action-btn secondary">View Guide</button>
            </div>
            <div className="guide-card">
              <div className="guide-icon">💻</div>
              <h4>Asset Management</h4>
              <p>How to request, manage, and return assets</p>
              <button className="action-btn secondary">View Guide</button>
            </div>
            <div className="guide-card">
              <div className="guide-icon">✅</div>
              <h4>Task Management</h4>
              <p>Managing your tasks and tracking progress</p>
              <button className="action-btn secondary">View Guide</button>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🔒</div>
              <h4>Security Best Practices</h4>
              <p>Keep your account and assets secure</p>
              <button className="action-btn secondary">View Guide</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Help;
