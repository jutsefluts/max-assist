import React from 'react';

const Sidebar = ({ addBlock }) => {
    return (
        <div id="sidebar">
            <button onClick={() => addBlock('template_text_image_right')}>Text and Image</button>
            <button onClick={() => addBlock('radios')}>Multiple Choice Question</button>
            <button onClick={() => addBlock('textarea')}>Open Question</button>
            <button onClick={() => addBlock('document_file')}>Document Upload</button>
        </div>
    );
};

export default Sidebar;
