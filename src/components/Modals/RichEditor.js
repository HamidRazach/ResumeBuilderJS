import React, { useEffect, useRef } from 'react';
// Import DOMPurify for HTML sanitization (you'll need to install this: npm install dompurify)
import DOMPurify from 'dompurify';

const RichTextEditor = ({ onChange, value }) => {
  const editorRef = useRef(null);

  // Sanitize HTML
  const sanitizeHTML = (html) => DOMPurify.sanitize(html);

  // Execute editor commands (using modern approach)
  const execCommand = (command, arg = null) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL', 'https://');
      if (!url) return; // Ensure a valid URL
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, arg);
    }
  };

  // Update editor content from props value, only if different
  useEffect(() => {
    if (editorRef.current && sanitizeHTML(editorRef.current.innerHTML) !== value) {
      editorRef.current.innerHTML = sanitizeHTML(value);
    }
  }, [value]);

  // Handle input changes and send sanitized HTML
  const handleInput = () => {
    if (editorRef.current) {
      const cleanHTML = sanitizeHTML(editorRef.current.innerHTML);
      onChange(cleanHTML);
    }
  };

  return (
    <div>
      <div className="btn-toolbar mb-3">
        <div className="btn-group mr-2">
          <button type='button' className="btn btn-light" onClick={() => execCommand('undo')}><i className="fas fa-undo"></i></button>
          <button type='button' className="btn btn-light" onClick={() => execCommand('redo')}><i className="fas fa-redo"></i></button>
        </div>
        <div className="btn-group mr-2">
          <button type='button' className="btn btn-light" onClick={() => execCommand('bold')}><b>B</b></button>
          <button type='button' className="btn btn-light" onClick={() => execCommand('italic')}><i>I</i></button>
          <button type='button' className="btn btn-light" onClick={() => execCommand('underline')}><u>U</u></button>
        </div>
        <div className="btn-group mr-2 toolbar-section">
          <button type='button' className="btn btn-light" onClick={() => execCommand('insertUnorderedList')}><i className="fas fa-list-ul"></i></button>
          <button type='button' className="btn btn-light" onClick={() => execCommand('insertOrderedList')}><i className="fas fa-list-ol"></i></button>
        </div>
        <div className="btn-group mr-2 toolbar-sections">
          <button type='button' className="btn btn-light" onClick={() => execCommand('createLink')}><i className="fas fa-link"></i></button>
          <button type='button' className="btn btn-light" onClick={() => execCommand('unlink')}><i className="fas fa-unlink"></i></button>
        </div>
      </div>
      <div
        className="text-description"
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          border: '1px solid #ccc',
          minHeight: '200px',
          padding: '10px',
          borderRadius: '4px',
          overflowY: 'auto', // Allows scrolling if content is too long
          maxHeight: '400px' // Optional, to prevent overly long content from expanding the editor
        }}
      ></div>
    </div>
  );
};

export default RichTextEditor;
