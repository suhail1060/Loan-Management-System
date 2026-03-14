const express = require('express');
const router = express.Router();
const { Ollama } = require('ollama');

// Initialize Ollama client
const ollama = new Ollama({ host: 'http://ollama:11434' });

// System prompt - defines chatbot behavior
const SYSTEM_PROMPT = `You are a helpful customer service assistant for MicroLoan, a loan management application.

Your role:
- Answer questions about loan applications
- Explain loan processes
- Help users understand their loan status
- Provide information about loan requirements

Loan Information:
- Loan amounts: $1,000 to $1,000,000
- Loan purposes: Home Purchase, Home Renovation, Car Purchase, Education, Business Expansion, Medical Emergency, Debt Consolidation
- Application process: Register → Apply → Admin Reviews → Approval/Rejection
- Loan statuses: Pending (under review), Approved (ready for disbursement), Rejected (application denied)

Guidelines:
- Be professional and friendly
- Keep responses concise (2-3 sentences max)
- If you don't know something, admit it and suggest contacting support
- Don't make up loan amounts, rates, or terms
- Stay focused on loan-related topics

Important: You cannot access real user data or loan details. For specific account questions, ask users to check their dashboard or contact support.`;

// POST - Chat with AI
router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Build messages array with conversation history
        const messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            // Include previous conversation
            ...conversationHistory,
            // Add current user message
            {
                role: 'user',
                content: message
            }
        ];

        // Call Ollama
        const response = await ollama.chat({
            model: 'llama3.2:1b',
            messages: messages,
            stream: false
        });

        res.json({
            success: true,
            data: {
                message: response.message.content,
                model: 'llama3.2:1b'
            }
        });

    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get response from chatbot'
        });
    }
});

module.exports = router;