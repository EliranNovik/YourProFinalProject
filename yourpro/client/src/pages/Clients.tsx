import React, { useState, useRef, useEffect } from 'react';
import './Clients.css';
import { 
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

export const mockClients = [
  {
    id: 1,
    name: 'Sarah Lee',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    joined: '2024-05-01T10:30:00Z',
    project: 'Branding package for new app',
    contact: 'sarah.lee@email.com',
    phone: '+1 555-1234',
    initialRequest: 'Client wants a new app branding package with logo, color palette, and brand guidelines.',
    projectPlan: '1. Onboarding\n2. Design\n3. Review',
    dueDate: '2024-06-13T12:00:00.000Z',
    messages: [
      { from: 'client', text: 'Hi, can you send the contract?', time: '2024-06-01T09:00:00Z' },
      { from: 'me', text: 'Sure! Sending now.', time: '2024-06-01T09:01:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' }, { text: 'Follow-up: All onboarding forms signed by client.', time: '2024-05-03T09:00:00Z' } ] },
      { step: 'Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Initial design drafts sent to client for feedback. Awaiting response.', time: '2024-05-10T15:30:00Z' }, { text: 'Client requested color changes.', time: '2024-05-11T10:00:00Z' }, { text: 'Updated designs sent.', time: '2024-05-12T14:00:00Z' } ] },
      { step: 'Review', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Review phase will begin once client approves the design.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-06-15T17:00:00.000Z',
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joined: '2024-04-15T14:20:00Z',
    project: 'Website redesign',
    contact: 'john.smith@email.com',
    phone: '+1 555-5678',
    initialRequest: 'Client wants a modern, responsive website redesign with improved navigation, updated branding, and integration of a blog and contact form. The goal is to increase user engagement and conversions.',
    dueDate: '2024-06-20T12:00:00.000Z',
    messages: [
      { from: 'client', text: 'Looking forward to our call!', time: '2024-06-02T11:00:00Z' },
      { from: 'me', text: 'Me too! See you then.', time: '2024-06-02T11:01:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' }, { text: 'Follow-up: All onboarding forms signed by client.', time: '2024-05-03T09:00:00Z' } ] },
      { step: 'Wireframes', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Wireframes completed and approved by client.', time: '2024-05-10T15:30:00Z' }, { text: 'Client requested additional revisions.', time: '2024-05-11T10:00:00Z' }, { text: 'Revised wireframes sent.', time: '2024-05-12T14:00:00Z' } ] },
      { step: 'Development', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Development phase in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' }, { text: 'Client requested additional features.', time: '2024-05-16T10:00:00Z' }, { text: 'New features implemented.', time: '2024-05-17T14:00:00Z' } ] },
      { step: 'Launch', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Launch phase will begin once all development tasks are completed and client approves the final product.', time: '2024-05-15T09:00:00Z' }, { text: 'Client requested final testing.', time: '2024-05-16T10:00:00Z' }, { text: 'Final testing completed. Launch scheduled for next week.', time: '2024-05-17T14:00:00Z' } ] },
    ],
    estEndDate: '2025-06-20T17:00:00.000Z',
  },
  // Additional mock clients
  {
    id: 3,
    name: 'Emily Carter',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    joined: '2024-03-10T09:00:00Z',
    project: 'Logo design',
    contact: 'emily.carter@email.com',
    phone: '+1 555-2345',
    initialRequest: "Client is seeking a fresh, minimalist logo that reflects her brand's values of creativity and trust. The logo should be versatile for both digital and print use, with a unique color palette.",
    dueDate: '2024-07-01T15:00:00.000Z',
    messages: [
      { from: 'client', text: 'Can you update the logo colors?', time: '2024-06-03T10:00:00Z' },
      { from: 'me', text: 'Absolutely, will do!', time: '2024-06-03T10:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' }, { text: 'Follow-up: All onboarding forms signed by client.', time: '2024-05-03T09:00:00Z' } ] },
      { step: 'Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Initial design drafts sent to client for feedback. Awaiting response.', time: '2024-05-10T15:30:00Z' }, { text: 'Client requested color changes.', time: '2024-05-11T10:00:00Z' }, { text: 'Updated designs sent.', time: '2024-05-12T14:00:00Z' } ] },
      { step: 'Approval', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Review phase will begin once client approves the design.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-07-01T17:00:00.000Z',
  },
  {
    id: 4,
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    joined: '2024-02-20T13:30:00Z',
    project: 'Mobile app UI',
    contact: 'michael.brown@email.com',
    phone: '+1 555-3456',
    initialRequest: 'Client requires a sleek and intuitive mobile app UI for a productivity tool. The design should focus on ease of use, vibrant visuals, and seamless navigation between features.',
    dueDate: '2024-07-10T10:00:00.000Z',
    messages: [
      { from: 'client', text: 'UI looks great so far!', time: '2024-06-04T12:00:00Z' },
      { from: 'me', text: 'Thanks for the feedback!', time: '2024-06-04T12:10:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' }, { text: 'Follow-up: All onboarding forms signed by client.', time: '2024-05-03T09:00:00Z' } ] },
      { step: 'Wireframes', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Wireframes completed and approved by client.', time: '2024-05-10T15:30:00Z' }, { text: 'Client requested additional revisions.', time: '2024-05-11T10:00:00Z' }, { text: 'Revised wireframes sent.', time: '2024-05-12T14:00:00Z' } ] },
      { step: 'UI Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'UI design phase in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' }, { text: 'Client requested additional features.', time: '2024-05-16T10:00:00Z' }, { text: 'New features implemented.', time: '2024-05-17T14:00:00Z' } ] },
      { step: 'Testing', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Testing phase will begin once UI design is completed and client approves the final product.', time: '2024-05-15T09:00:00Z' }, { text: 'Client requested final testing.', time: '2024-05-16T10:00:00Z' }, { text: 'Final testing completed. Launch scheduled for next week.', time: '2024-05-17T14:00:00Z' } ] },
    ],
    estEndDate: '2025-07-10T17:00:00.000Z',
  },
  {
    id: 5,
    name: 'Olivia Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    joined: '2024-01-18T11:15:00Z',
    project: 'Business cards',
    contact: 'olivia.wilson@email.com',
    phone: '+1 555-4567',
    initialRequest: 'Client wants a set of premium business cards with a bold, professional look. The cards should include a custom logo, unique typography, and a memorable color scheme.',
    dueDate: '2024-07-15T09:00:00.000Z',
    messages: [
      { from: 'client', text: 'Can you send the print files?', time: '2024-06-05T14:00:00Z' },
      { from: 'me', text: 'Sending them now!', time: '2024-06-05T14:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Design', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Delivery', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Delivery phase in progress. Printing and packaging in progress.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-07-15T17:00:00.000Z',
  },
  {
    id: 6,
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    joined: '2024-03-22T16:45:00Z',
    project: 'Landing page',
    contact: 'david.kim@email.com',
    phone: '+1 555-5679',
    initialRequest: 'Client needs a high-converting landing page for a new SaaS product launch. The page should highlight key features, include customer testimonials, and have a clear call to action.',
    dueDate: '2024-07-20T11:00:00.000Z',
    messages: [
      { from: 'client', text: 'Let me know when the draft is ready.', time: '2024-06-06T15:00:00Z' },
      { from: 'me', text: 'Will do!', time: '2024-06-06T15:10:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Draft', status: 'in-progress', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Draft design sent to client for feedback. Awaiting response.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Review', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Review phase will begin once client approves the design.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-07-20T17:00:00.000Z',
  },
  {
    id: 7,
    name: 'Sophia Turner',
    avatar: 'https://randomuser.me/api/portraits/women/70.jpg',
    joined: '2024-04-05T08:30:00Z',
    project: 'Social media kit',
    contact: 'sophia.turner@email.com',
    phone: '+1 555-6780',
    initialRequest: 'Client is looking for a comprehensive social media kit, including Instagram templates, story highlights, and branded graphics to boost her online presence and engagement.',
    dueDate: '2024-07-25T13:00:00.000Z',
    messages: [
      { from: 'client', text: 'Can you add Instagram templates?', time: '2024-06-07T16:00:00Z' },
      { from: 'me', text: 'Yes, adding them now.', time: '2024-06-07T16:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Kit Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Kit design phase in progress. Regular updates provided to client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Delivery', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Delivery phase in progress. Printing and packaging in progress.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-07-25T17:00:00.000Z',
  },
  {
    id: 8,
    name: 'James Anderson',
    avatar: 'https://randomuser.me/api/portraits/men/80.jpg',
    joined: '2024-02-28T10:00:00Z',
    project: 'Brochure design',
    contact: 'james.anderson@email.com',
    phone: '+1 555-7891',
    initialRequest: "Client wants a tri-fold brochure to showcase his company's services. The design should be clean, informative, and visually appealing, with space for testimonials and contact info.",
    dueDate: '2024-08-01T17:00:00.000Z',
    messages: [
      { from: 'client', text: 'Brochure draft looks good!', time: '2024-06-08T17:00:00Z' },
      { from: 'me', text: 'Thank you!', time: '2024-06-08T17:10:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Draft', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Draft design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Final Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Final design in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-01T17:00:00.000Z',
  },
  {
    id: 9,
    name: 'Ava Martinez',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    joined: '2024-01-30T12:00:00Z',
    project: 'Flyer design',
    contact: 'ava.martinez@email.com',
    phone: '+1 555-8902',
    initialRequest: 'Client needs a vibrant, eye-catching flyer for an upcoming event. The flyer should include event details, bold graphics, and a QR code for easy registration.',
    dueDate: '2024-08-10T18:00:00.000Z',
    messages: [
      { from: 'client', text: 'Can you make the flyer more colorful?', time: '2024-06-09T18:00:00Z' },
      { from: 'me', text: 'Sure, updating now.', time: '2024-06-09T18:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Initial design drafts sent to client for feedback. Awaiting response.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Approval', status: 'pending', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Review phase will begin once client approves the design.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-10T17:00:00.000Z',
  },
  {
    id: 10,
    name: 'William Clark',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    joined: '2024-03-12T14:00:00Z',
    project: 'Poster design',
    contact: 'william.clark@email.com',
    phone: '+1 555-9013',
    initialRequest: "Client is seeking a bold, modern poster for a product launch event. The poster should feature dynamic visuals, clear messaging, and the company's branding elements.",
    dueDate: '2024-08-15T19:00:00.000Z',
    messages: [
      { from: 'client', text: 'Poster is almost perfect!', time: '2024-06-10T19:00:00Z' },
      { from: 'me', text: 'I can tweak it more.', time: '2024-06-10T19:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Design', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Final Touches', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Final touches phase in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-15T17:00:00.000Z',
  },
  {
    id: 11,
    name: 'Mia Lewis',
    avatar: 'https://randomuser.me/api/portraits/women/92.jpg',
    joined: '2024-02-14T15:00:00Z',
    project: 'Newsletter design',
    contact: 'mia.lewis@email.com',
    phone: '+1 555-0124',
    initialRequest: 'Client wants a monthly newsletter template that is visually engaging and easy to update. The design should support articles, images, and calls to action for readers.',
    dueDate: '2024-08-20T20:00:00.000Z',
    messages: [
      { from: 'client', text: 'Newsletter looks great!', time: '2024-06-11T20:00:00Z' },
      { from: 'me', text: 'Glad you like it!', time: '2024-06-11T20:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Draft', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Draft design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Final Design', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Final design in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-20T17:00:00.000Z',
  },
  {
    id: 12,
    name: 'Benjamin Walker',
    avatar: 'https://randomuser.me/api/portraits/men/93.jpg',
    joined: '2024-01-25T16:00:00Z',
    project: 'Presentation slides',
    contact: 'benjamin.walker@email.com',
    phone: '+1 555-1235',
    initialRequest: 'Client needs a set of professional presentation slides for a business pitch. The slides should be visually appealing, concise, and include infographics and data visualizations.',
    dueDate: '2024-08-25T21:00:00.000Z',
    messages: [
      { from: 'client', text: 'Slides are very professional.', time: '2024-06-12T21:00:00Z' },
      { from: 'me', text: 'Thank you!', time: '2024-06-12T21:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Draft', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Draft design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Review', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Review phase in progress. Regular updates provided to client.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-25T17:00:00.000Z',
  },
  {
    id: 13,
    name: 'Charlotte Hall',
    avatar: 'https://randomuser.me/api/portraits/women/94.jpg',
    joined: '2024-03-05T17:00:00Z',
    project: 'Infographic design',
    contact: 'charlotte.hall@email.com',
    phone: '+1 555-2346',
    initialRequest: 'Client is looking for a detailed infographic to explain a complex process. The design should be easy to follow, visually engaging, and suitable for both web and print.',
    dueDate: '2024-08-30T22:00:00.000Z',
    messages: [
      { from: 'client', text: 'Infographic is very clear.', time: '2024-06-13T22:00:00Z' },
      { from: 'me', text: 'Happy to hear that!', time: '2024-06-13T22:05:00Z' },
    ],
    process: [
      { step: 'Onboarding', status: 'done', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Client onboarding completed successfully. All initial documents received and reviewed.', time: '2024-05-02T12:00:00Z' } ] },
      { step: 'Design', status: 'done', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Design completed and approved by client.', time: '2024-05-10T15:30:00Z' } ] },
      { step: 'Delivery', status: 'in-progress', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64', reports: [ { text: 'Delivery phase in progress. Printing and packaging in progress.', time: '2024-05-15T09:00:00Z' } ] },
    ],
    estEndDate: '2025-08-30T17:00:00.000Z',
  },
];

const processStepImages = [
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1519340333755-c892b7b7a2c5?auto=format&fit=facearea&w=400&h=400',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const statusIcon = (status: string) => {
  if (status === 'done') return <span style={{marginRight:8}}><CheckCircleIcon sx={{ color: "#22c55e", fontSize: 22 }} /></span>;
  if (status === 'in-progress') return <span style={{marginRight:8}}><HourglassEmptyIcon sx={{ color: "#fbbf24", fontSize: 22 }} /></span>;
  return <span style={{marginRight:8}}><RadioButtonUncheckedIcon sx={{ color: "#a3a3a3", fontSize: 22 }} /></span>;
};

const statusBadge = (status: string) => {
  if (status === 'done') return <span className="timeline-status-badge done">Done</span>;
  if (status === 'in-progress') return <span className="timeline-status-badge in-progress">In Progress</span>;
  return <span className="timeline-status-badge pending">Pending</span>;
};

const Clients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(mockClients[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const selectedClient = mockClients.find(c => c.id === selectedId);
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'messages' | 'payments'>('overview');
  const [zoomImg, setZoomImg] = useState<string|null>(null);
  const [zoomTitle, setZoomTitle] = useState<string|null>(null);
  const [expandedStep, setExpandedStep] = useState<number|null>(null);
  const [sortType, setSortType] = useState<string>('');
  const [handlerNotesExpanded, setHandlerNotesExpanded] = useState(false);
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  const [hoveredClientId, setHoveredClientId] = useState<number | null>(null);
  const [localClients, setLocalClients] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('clients') || '[]');
    setLocalClients(stored);
  }, []);

  const allClients = [
    ...mockClients,
    ...localClients.filter(lc => !mockClients.some(mc => {
      // Only compare targetId/type for local clients
      // For mock clients, fallback to id
      // If mock client has no targetId/type, skip
      // If local client has no targetId/type, skip
      // This prevents linter errors
      // @ts-ignore
      return mc.targetId && mc.type && lc.targetId && lc.type && mc.targetId === lc.targetId && mc.type === lc.type && mc.project === lc.project;
    })),
  ];

  const getProjectStatus = (client: typeof mockClients[0]) => {
    const statuses = client.process.map(s => s.status);
    if (statuses.every(s => s === 'done')) return 'finished';
    if (statuses[0] === 'done' && statuses.some(s => s === 'in-progress')) return 'in progress';
    if (statuses[0] === 'in-progress') return 'in onboarding';
    return statuses.find(s => s === 'in-progress') ? 'in progress' : 'in onboarding';
  };

  const getProgressStage = (client: typeof mockClients[0]) => {
    const done = client.process.filter(s => s.status === 'done').length;
    return done / client.process.length;
  };

  const sortedClients = [...mockClients].sort((a, b) => {
    if (!sortType) return 0;
    if (sortType === 'start') {
      return new Date(a.joined).getTime() - new Date(b.joined).getTime();
    } else if (sortType === 'due') {
      return (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0);
    } else if (sortType === 'estend') {
      return (a.estEndDate ? new Date(a.estEndDate).getTime() : 0) - (b.estEndDate ? new Date(b.estEndDate).getTime() : 0);
    } else if (sortType === 'status') {
      return getProjectStatus(a).localeCompare(getProjectStatus(b));
    } else if (sortType === 'progress') {
      return getProgressStage(b) - getProgressStage(a);
    }
    return 0;
  });

  // Use allClients (merged) for filtering and search, not just sortedClients
  const filteredClients = allClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.project.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedClient) return;
    selectedClient.messages.push({ from: 'me', text: messageInput, time: new Date().toISOString() });
    setMessageInput('');
  };

  const handleOpenInvoice = (payment: any, client: any) => {
    // Use the company name from the dashboard
    const companyName = 'CloudTech Solutions';
    // Calculate issued and due dates
    const issuedDate = payment.paidDate ? new Date(payment.paidDate) : new Date();
    const dueDate = new Date(issuedDate);
    dueDate.setMonth(issuedDate.getMonth() + 1);
    // Construct query params for the invoice
    const params = new URLSearchParams({
      clientName: client.name,
      clientCompany: companyName,
      clientEmail: client.contact,
      clientPhone: client.phone || '',
      project: client.project,
      invoiceNumber: payment.invoiceNumber || Math.floor(Math.random() * 100000).toString(),
      issuedOn: issuedDate.toLocaleDateString(),
      paidDate: payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '',
      item: payment.step,
      qty: '1',
      price: `$${payment.amount.toFixed(2)}`,
      total: `$${payment.amount.toFixed(2)}`,
    });
    window.open(`/PaymentsInvoice?${params.toString()}`, '_blank');
  };

  const handleClientCardClick = (id: number) => {
    setSelectedId(id);
    setTimeout(() => {
      if (detailsPanelRef.current) {
        if (window.innerWidth < 700) {
          // Mobile: scroll the window to the details panel
          const rect = detailsPanelRef.current.getBoundingClientRect();
          const scrollTop = window.scrollY + rect.top - 10; // 10px offset for padding
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        } else {
          // Desktop: use scrollIntoView
          detailsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  };

  const isDarkMode = false; // Force light mode backgrounds for this page

  return (
    <div className="clients-page">
      <div className="clients-sidebar">
        <div className="clients-controls">
          <input
            className="clients-search"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 15 }}
            >
              <option value="">Sort by...</option>
              <option value="start">Start Date</option>
              <option value="due">Due Date</option>
              <option value="estend">Est. End Date</option>
              <option value="status">Project Status</option>
              <option value="progress">Progress Stage</option>
            </select>
          </div>
        </div>
        <div className="clients-list">
          {filteredClients.map((client, idx) => {
            const isLocal = typeof (client as any).targetId !== 'undefined' && typeof (client as any).type !== 'undefined';
            const key = isLocal ? ((client as any).bookingId || ((client as any).type + '-' + (client as any).targetId)) : client.id;
            return (
              <div
                key={key}
                className={`client-card${selectedId === key ? ' selected' : ''}`}
                onClick={() => handleClientCardClick(key)}
                onMouseEnter={() => setHoveredClientId(key)}
                onMouseLeave={() => setHoveredClientId(null)}
              >
                <img src={client.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={client.name} className="client-avatar" />
                <div>
                  <div className="client-name">{client.name}</div>
                  <div className="client-joined">{isLocal && (client as any).date ? (client as any).date : formatDate((client as any).joined)}</div>
                  <div className="client-project">{client.project}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="client-details-panel" ref={detailsPanelRef}>
        {selectedClient && (
          <>
            <div className="client-details-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={selectedClient.avatar} alt={selectedClient.name} className="client-details-avatar" />
                <div>
                  <div className="client-details-name">{selectedClient.name}</div>
                  <div className="client-details-project">{selectedClient.project}</div>
                  <div className="client-details-contact">
                    {selectedClient.contact} | {selectedClient.phone}
                    <a
                      href={`tel:${selectedClient.phone}`}
                      style={{
                        marginLeft: 10,
                        background: '#2563eb',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px #2563eb33',
                        fontSize: 16,
                        transition: 'background 0.18s',
                        verticalAlign: 'middle',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        top: -2
                      }}
                      title={`Call ${selectedClient.name}`}
                      aria-label={`Call ${selectedClient.name}`}
                    >
                      <PhoneIcon sx={{ fontSize: 16 }} />
                    </a>
                  </div>
                </div>
              </div>
              {/* Project Tracking Overview */}
              <div style={{
                minWidth: 240,
                maxWidth: 260,
                background: isDarkMode ? '#23263a' : '#fff',
                borderRadius: 14,
                boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                padding: '18px 18px 16px 18px',
                marginLeft: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                fontSize: 16
              }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 2 }}>Project Tracking</div>
                {/* Progress bar */}
                {(() => {
                  const totalStages = selectedClient.process.length;
                  const completedStages = selectedClient.process.filter(s => s.status === 'done').length;
                  const percent = Math.round((completedStages / totalStages) * 100);
                  const totalCost = 5000;
                  const costPerStage = totalCost / totalStages;
                  const completedCost = completedStages * costPerStage;
                  return (
                    <>
                      <div style={{ width: '100%', height: 10, borderRadius: 6, background: '#e5e7eb', marginBottom: 12, marginTop: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)', borderRadius: 6, transition: 'width 0.4s' }} />
                      </div>
                      <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15, marginBottom: 4 }}>{completedStages} of {totalStages} stages completed</div>
                      <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15, fontWeight: 500, marginTop: 2 }}>Total Cost: ${totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="client-details-tabs">
              <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Project Overview</button>
              <button className={activeTab === 'process' ? 'active' : ''} onClick={() => setActiveTab('process')}>Project Process</button>
              <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Messages</button>
              <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>Payments</button>
            </div>
            <div className="client-details-content">
              {activeTab === 'overview' && (
                <div className="project-overview-tab" style={{
                  padding: 32,
                  background: isDarkMode ? '#23263a' : '#fff',
                  borderRadius: 18,
                  minHeight: 600,
                  overflowY: 'auto',
                  paddingBottom: 48
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 24,
                    alignItems: 'stretch',
                    maxWidth: 1200,
                    margin: '0 auto'
                  }}>
                    {/* Project Summary Card */}
                    <div className="overview-card-hover" style={{
                      gridColumn: '1 / span 2',
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 28,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}>
                      <h2 style={{ color: isDarkMode ? '#bfc8f8' : '#1e293b', fontWeight: 700, fontSize: 24, marginBottom: 6 }}>Project Overview</h2>
                      <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 16, marginBottom: 8, fontStyle: 'italic' }}>{selectedClient.initialRequest}</div>
                      <div style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 600, fontSize: 18 }}>{selectedClient.project}</div>
                    </div>
                    {/* Key Dates and Recent Activity side by side */}
                    <div style={{ display: 'flex', gap: 24, gridColumn: '1 / span 2' }}>
                      {/* Key Dates */}
                      <div className="overview-card-hover" style={{
                        background: isDarkMode ? '#23263a' : '#fff',
                        borderRadius: 14,
                        boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        flex: 1,
                        minWidth: 0
                      }}>
                        <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Key Dates</h3>
                        <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>Start:</b> {formatDate(selectedClient.joined)}</div>
                        <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>Next Milestone:</b> Design Review</div>
                        <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>Est. End:</b> {selectedClient.estEndDate ? formatDate(selectedClient.estEndDate) : 'N/A'}</div>
                      </div>
                      {/* Recent Activity */}
                      <div className="overview-card-hover" style={{
                        background: isDarkMode ? '#23263a' : '#fff',
                        borderRadius: 14,
                        boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        flex: 1,
                        minWidth: 0
                      }}>
                        <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Recent Activity</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          <li style={{ marginBottom: 8, color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>5/12/2024:</b> Updated designs sent to client.</li>
                          <li style={{ marginBottom: 8, color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>5/11/2024:</b> Client requested color changes.</li>
                          <li style={{ marginBottom: 8, color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15 }}><b>5/10/2024:</b> Initial design drafts sent for feedback.</li>
                        </ul>
                      </div>
                    </div>
                    {/* Project Handler */}
                    <div className="overview-card-hover" style={{
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16
                    }}>
                      <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 12, fontSize: 20, textAlign: 'center' }}>Project Handler</h3>
                      <img src="https://i.pravatar.cc/150?img=32" alt="Alex Johnson" style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 12 }} />
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#bfc8f8' : '#1e293b', fontSize: 22, textAlign: 'center', marginBottom: 4 }}>Alex Johnson</div>
                      <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 17, textAlign: 'center' }}>Project Manager</div>
                    </div>

                    {/* Handler's Notes */}
                    <div className="overview-card-hover" style={{
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}>
                      <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Handler's Notes</h3>
                      <div
                        style={{
                          color: isDarkMode ? '#bfc8f8' : '#475569',
                          fontSize: 14,
                          lineHeight: 1.5,
                          maxHeight: handlerNotesExpanded ? 800 : 120,
                          overflowY: handlerNotesExpanded ? 'auto' : 'hidden',
                          paddingRight: 8,
                          position: 'relative',
                          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)'
                        }}
                      >
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 500, color: isDarkMode ? '#bfc8f8' : '#1e293b', marginBottom: 4 }}>Initial Meeting Notes</div>
                          <div>Client emphasized the importance of maintaining brand consistency across all deliverables. Need to ensure all design elements align with existing brand guidelines.</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 500, color: isDarkMode ? '#bfc8f8' : '#1e293b', marginBottom: 4 }}>Key Requirements</div>
                          <div>• Responsive design is a priority<br />• Need to incorporate client's existing color scheme<br />• Focus on user experience and accessibility</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: isDarkMode ? '#bfc8f8' : '#1e293b', marginBottom: 4 }}>Follow-up Items</div>
                          <div>• Schedule weekly progress meetings<br />• Get approval on wireframes by next Friday<br />• Prepare presentation for stakeholder review</div>
                        </div>
                        {!handlerNotesExpanded && (
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 40,
                            background: 'linear-gradient(0deg, #fff 80%, rgba(255,255,255,0.01) 100%)',
                            pointerEvents: 'none',
                            transition: 'opacity 0.3s',
                          }} />
                        )}
                      </div>
                      <button
                        onClick={() => setHandlerNotesExpanded(exp => !exp)}
                        style={{
                          marginTop: 6,
                          alignSelf: 'flex-end',
                          background: 'none',
                          border: 'none',
                          color: isDarkMode ? '#2563eb' : '#2563eb',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {handlerNotesExpanded ? 'Show less' : 'Show more'}
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="overview-card-hover" style={{
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Progress</h3>
                      <svg width="70" height="70" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="#e5e7eb" />
                        <circle cx="20" cy="20" r="16" fill="none" stroke={isDarkMode ? '#2563eb' : '#2563eb'} strokeWidth="5" strokeDasharray={`${Math.round((selectedClient.process.filter(s => s.status === 'done').length / selectedClient.process.length) * 100)},100`} strokeDashoffset="25" />
                      </svg>
                      <div style={{ fontWeight: 500, color: isDarkMode ? '#2563eb' : '#2563eb', fontSize: 15 }}>{selectedClient.process.filter(s => s.status === 'done').length} / {selectedClient.process.length} Stages Done</div>
                    </div>
                    {/* Budget */}
                    <div className="overview-card-hover" style={{
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}>
                      <h3 style={{ color: isDarkMode ? '#22c55e' : '#22c55e', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Budget</h3>
                      <div style={{ fontSize: 20, color: isDarkMode ? '#22c55e' : '#22c55e', fontWeight: 700 }}>$5000.00</div>
                      <div style={{ color: isDarkMode ? '#bfc8f8' : '#64748b', fontSize: 13 }}>Budget Utilization</div>
                      <div style={{ width: '100%', height: 8, borderRadius: 6, background: '#e5e7eb', marginTop: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((selectedClient.process.filter(s => s.status === 'done').length / selectedClient.process.length) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e 60%, #bbf7d0 100%)', borderRadius: 6, transition: 'width 0.4s' }} />
                      </div>
                    </div>
                    {/* Stylish Vertical Timeline */}
                    <div className="overview-timeline overview-card-hover" style={{
                      background: isDarkMode ? '#23263a' : '#fff',
                      borderRadius: 14,
                      boxShadow: isDarkMode ? '0 8px 32px #10121a' : '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      gridColumn: '1 / span 2',
                      position: 'relative',
                      minHeight: 220
                    }}>
                      <h3 style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 700, marginBottom: 8, fontSize: 17 }}>Timeline</h3>
                      <div style={{ position: 'relative', marginLeft: 18 }}>
                        {selectedClient.process.map((step, idx) => (
                          <div key={idx} className={`overview-timeline-step ${step.status}`} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            position: 'relative',
                            marginBottom: idx < selectedClient.process.length - 1 ? 36 : 0,
                            zIndex: 2
                          }}>
                            {/* Connector line */}
                            {idx < selectedClient.process.length - 1 && (
                              <div style={{
                                position: 'absolute',
                                left: 24,
                                top: 44,
                                width: 4,
                                height: 48,
                                background: step.status === 'done' ? 'linear-gradient(180deg, #22c55e 0%, #bbf7d0 100%)' : step.status === 'in-progress' ? 'linear-gradient(180deg, #fbbf24 0%, #fde68a 100%)' : 'linear-gradient(180deg, #e5e7eb 0%, #f3f4f6 100%)',
                                borderRadius: 2,
                                zIndex: 1
                              }} />
                            )}
                            {/* Status Icon */}
                            <div style={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              background: step.status === 'done' ? '#22c55e' : step.status === 'in-progress' ? '#fbbf24' : '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: 26,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                              marginRight: 24,
                              zIndex: 2,
                              border: step.status === 'in-progress' ? isDarkMode ? '3px solid #23263a' : '3px solid #fde68a' : 'none',
                              transition: 'box-shadow 0.2s'
                            }}>
                              {step.status === 'done' ? <CheckCircleIcon /> : step.status === 'in-progress' ? <HourglassEmptyIcon /> : <RadioButtonUncheckedIcon />}
                            </div>
                            {/* Card Content */}
                            <div style={{
                              background: isDarkMode ? '#181c24' : '#f8fafc',
                              borderRadius: 12,
                              boxShadow: '0 2px 8px #e5eaf1',
                              padding: '18px 24px',
                              minWidth: 0,
                              flex: 1,
                              marginBottom: 0,
                              borderLeft: `5px solid ${step.status === 'done' ? '#22c55e' : step.status === 'in-progress' ? '#fbbf24' : '#e5e7eb'}`,
                              position: 'relative',
                              transition: 'box-shadow 0.2s',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontWeight: 700, fontSize: 18, color: '#23236a' }}>{step.step}</span>
                                <span className={`timeline-status-badge ${step.status}`} style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '2px 10px', background: step.status === 'done' ? '#d1fae5' : step.status === 'in-progress' ? '#fef3c7' : '#f3f4f6', color: step.status === 'done' ? '#059669' : step.status === 'in-progress' ? '#b45309' : '#64748b' }}>{step.status.replace('-', ' ')}</span>
                                {step.reports && step.reports[0]?.time && (
                                  <span style={{ marginLeft: 14, color: '#64748b', fontSize: 13 }}>
                                    <span style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }}><AccessTimeIcon sx={{ fontSize: 13 }} /></span>{formatDate(step.reports[0].time)}
                                  </span>
                                )}
                              </div>
                              {step.reports && step.reports[0]?.text && (
                                <div style={{ color: isDarkMode ? '#bfc8f8' : '#334155', fontSize: 15, marginTop: 6 }}>{step.reports[0].text}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'process' && (
                <div className="client-process-timeline">
                  {selectedClient.process.map((step, idx) => (
                    <div
                      key={idx}
                      className={`timeline-step-card ${step.status} ${expandedStep === idx ? 'expanded' : ''}`}
                      style={{
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        borderRadius: 16,
                        marginBottom: 32,
                        background: isDarkMode ? '#23263a' : '#fff',
                        position: 'relative',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        border: `3px solid ${step.status === 'done' ? '#22c55e' : step.status === 'in-progress' ? '#fbbf24' : '#e5e7eb'}`
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 24 }} onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}>
                        <div style={{ marginRight: 18, display: 'flex', alignItems: 'center' }}>
                          {statusIcon(step.status)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 20, display: 'flex', alignItems: 'center' }}>
                            {step.step}
                            <span style={{ marginLeft: 14 }}>{statusBadge(step.status)}</span>
                          </div>
                        </div>
                        <img
                          src={`https://picsum.photos/160/160?random=${selectedClient.id * 100 + idx}`}
                          alt=""
                          className="timeline-step-img"
                          tabIndex={0}
                          style={{ width: 160, height: 160, borderRadius: 12, objectFit: 'cover', marginLeft: 18, border: 'none', boxShadow: 'none' }}
                          onError={e => { e.currentTarget.src = 'https://picsum.photos/160/160?random=999'; }}
                        />
                        <span style={{ marginLeft: 18, color: '#2563eb', fontSize: 18 }}>{expandedStep === idx ? <EditIcon sx={{ fontSize: 18 }} /> : <DescriptionIcon sx={{ fontSize: 18 }} />}</span>
                      </div>
                      <div
                        className="timeline-step-details"
                        style={{
                          maxHeight: expandedStep === idx ? 'none' : 0,
                          overflow: expandedStep === idx ? 'visible' : 'hidden',
                          transition: expandedStep === idx ? 'padding 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s cubic-bezier(0.4,0,0.2,1)' : 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                          background: isDarkMode ? '#181c24' : '#f8fafc',
                          borderRadius: expandedStep === idx ? '0 0 16px 16px' : '0 0 16px 16px',
                          padding: expandedStep === idx ? '20px 32px' : '0 32px',
                          fontSize: 16,
                          color: isDarkMode ? '#bfc8f8' : '#334155',
                          boxSizing: 'border-box',
                        }}
                      >
                        {expandedStep === idx && step.reports && (
                          <>
                            {step.reports.map((r, i) => (
                              <div key={i} style={{
                                marginBottom: 16,
                                padding: '16px 18px',
                                background: '#e0f2fe', // light blue
                                borderRadius: 10,
                                border: '1px solid #bae6fd',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'relative',
                                ...(i < step.reports.length - 1 ? { marginBottom: 24 } : {})
                              }}>
                                <div style={{ color: '#0369a1', fontSize: 14, marginBottom: 6, fontWeight: 500, letterSpacing: 0.2 }}>{formatDate(r.time)}</div>
                                <div style={{ fontSize: 16, color: '#0c223a' }}>{r.text}</div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {idx < selectedClient.process.length - 1 && (
                        <>
                          {/* Timeline vertical line with node */}
                          <div style={{
                            position: 'absolute',
                            left: 36,
                            top: '100%',
                            width: 8,
                            height: 48,
                            background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                            borderRadius: 8,
                            zIndex: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: '50%',
                              top: -8,
                              transform: 'translateX(-50%)',
                              width: 20,
                              height: 20,
                              background: '#fff',
                              border: '4px solid #2563eb',
                              borderRadius: '50%',
                              boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                              zIndex: 2
                            }} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {zoomImg && (
                    <div className="timeline-img-zoom-overlay" onClick={() => setZoomImg(null)}>
                      <button className="timeline-img-zoom-close" onClick={e => { e.stopPropagation(); setZoomImg(null); }}>&times;</button>
                      <img src={zoomImg} alt={zoomTitle || ''} className="timeline-img-zoomed" />
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'messages' && (
                <div className="client-messages-chat">
                  <div className="messages-list">
                    {selectedClient.messages.map((msg, idx) => (
                      <div key={idx} className={`chat-bubble ${msg.from === 'me' ? 'me' : 'client'}`}>{msg.text}<span className="chat-time" style={msg.from === 'me' ? { color: '#fff' } : {}}>{formatDate(msg.time)}</span></div>
                    ))}
                  </div>
                  <div className="chat-input-row-wrapper">
                    <div className="chat-input-row">
                      <input
                        className="chat-input"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button className="chat-send-btn" onClick={handleSendMessage}>Send</button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'payments' && (
                <div className="client-payments-tab" style={{
                  padding: 32,
                  background: isDarkMode ? '#23263a' : '#fff',
                  borderRadius: 18,
                  minHeight: 400,
                  overflowY: 'auto',
                  paddingBottom: 48
                }}>
                  <h2 style={{ color: isDarkMode ? '#bfc8f8' : '#1e293b', fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Payment Plan</h2>
                  {(() => {
                    const totalStages = selectedClient.process.length;
                    const totalCost = 5000;
                    const costPerStage = totalCost / totalStages;
                    // Mock: payments done for 'done' stages, future for others
                    const payments = selectedClient.process.map((step, idx) => {
                      const isPaid = step.status === 'done';
                      const isUpcoming = step.status !== 'done';
                      // Paid date: use last report time if exists, else joined
                      let paidDate = null;
                      if (isPaid && step.reports && step.reports.length > 0) {
                        paidDate = step.reports[step.reports.length - 1].time;
                      } else if (isPaid) {
                        paidDate = selectedClient.joined;
                      }
                      // Future payment date: spread after today, or use estEndDate for last
                      let futureDate = null;
                      if (isUpcoming) {
                        if (selectedClient.estEndDate && idx === totalStages - 1) {
                          futureDate = selectedClient.estEndDate;
                        } else {
                          // Spread future payments before estEndDate
                          const estEnd = selectedClient.estEndDate ? new Date(selectedClient.estEndDate) : new Date();
                          const now = new Date();
                          const msPerStage = (estEnd.getTime() - now.getTime()) / (totalStages - selectedClient.process.filter(s => s.status === 'done').length);
                          futureDate = new Date(now.getTime() + msPerStage * (idx + 1 - selectedClient.process.filter(s => s.status === 'done').length)).toISOString();
                        }
                      }
                      return {
                        step: step.step,
                        status: step.status,
                        amount: costPerStage,
                        paidDate,
                        futureDate,
                      };
                    });
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto' }}>
                        {payments.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={p.status === 'done' ? () => handleOpenInvoice(p, selectedClient) : undefined}
                            className={p.status === 'done' ? 'clickable-invoice-row' : ''}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isDarkMode ? '#23263a' : '#fff',
                              borderRadius: 22,
                              padding: '36px 48px',
                              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                              color: p.status === 'done' ? '#166534' : isDarkMode ? '#bfc8f8' : '#1e293b',
                              border: p.status === 'done'
                                ? isDarkMode ? '3px solid #23263a' : '3px solid #22c55e'
                                : p.status === 'in-progress'
                                  ? isDarkMode ? '3px solid #23263a' : '3px solid #2563eb'
                                  : '3px solid #e5e7eb',
                              backgroundColor: p.status === 'done'
                                ? isDarkMode ? '#181c24' : '#f0fdf4'
                                : p.status === 'in-progress'
                                  ? isDarkMode ? '#181c24' : '#eff6ff'
                                  : '#f8fafc',
                              opacity: p.status === 'pending' ? 0.85 : 1,
                              transition: 'box-shadow 0.2s, border 0.2s',
                              minHeight: 100,
                              fontSize: 22,
                              marginBottom: 12
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 26, color: '#2563eb' }}>{p.step}</div>
                            <div style={{ fontWeight: 800, fontSize: 28, color: '#22c55e' }}>${p.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                            <div style={{ fontSize: 19, fontWeight: 600, color: isDarkMode ? '#bfc8f8' : '#334155' }}>
                              {p.status === 'done' && p.paidDate && (
                                <span>Paid on <span style={{ color: '#16a34a' }}>{formatDate(p.paidDate)}</span></span>
                              )}
                              {p.status !== 'done' && p.futureDate && (
                                <span>Due <span style={{ color: '#2563eb' }}>{formatDate(p.futureDate)}</span></span>
                              )}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>
                              {p.status === 'done' ? <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 32 }} /> : <AccessTimeIcon sx={{ color: "#2563eb", fontSize: 32 }} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Clients; 