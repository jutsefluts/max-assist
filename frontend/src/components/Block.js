import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Block = ({ id, type, onRemove, onMoveUp, onMoveDown, onContentChange, content = {}, onAddQuestion }) => {
    const [editorHtml, setEditorHtml] = useState(content.text || '');
    const [imageSrc, setImageSrc] = useState(content.image || '');
    const [imageType, setImageType] = useState(content.imageType || 'small');
    const editorRef = useRef(null);

    useEffect(() => {
        setEditorHtml(content.text || '');
        setImageSrc(content.image || '');
        setImageType(content.imageType || 'small');
    }, [content]);

    const handleEditorChange = (content, delta, source, editor) => {
        setEditorHtml(editor.getHTML());
        onContentChange(id, { ...content, text: editor.getHTML() });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            setImageSrc(result);
            onContentChange(id, { ...content, image: result, imageType });
        };
        reader.readAsDataURL(file);
    };

    const handleImageDelete = () => {
        setImageSrc('');
        onContentChange(id, { ...content, image: '', imageType });
    };

    const handleImageTypeChange = (type) => {
        setImageType(type);
        onContentChange(id, { ...content, imageType: type });
    };

    const getBlockHTML = (type) => {
        switch (type) {
            case 'template_text_image_right':
                return (
                    <div className="block-content template-small-image-content">
                        <label>Text and image:</label>
                        <div className="upload-wrapper">
                            <input type="file" className="image-upload" accept="image/*" onChange={handleImageUpload} title="Add image" />
                            {imageSrc && (
                                <div className="image-buttons">
                                    <button
                                        onClick={() => handleImageTypeChange('small')}
                                        className={imageType === 'small' ? 'active' : ''}
                                    >
                                        Small Image
                                    </button>
                                    <button
                                        onClick={() => handleImageTypeChange('large')}
                                        className={imageType === 'large' ? 'active' : ''}
                                    >
                                        Large Image
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="content-wrapper" style={{ flexGrow: 1 }}>
                            <ReactQuill
                                ref={editorRef}
                                value={editorHtml}
                                onChange={handleEditorChange}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link']
                                    ],
                                    clipboard: {
                                        matchVisual: false,
                                    },
                                }}
                                formats={[
                                    'header',
                                    'bold', 'italic', 'underline',
                                    'list', 'bullet',
                                    'link'
                                ]}
                                style={{ height: '300px' }}
                            />
                            {imageSrc && imageType === 'small' && (
                                <div className="image-wrapper">
                                    <img src={imageSrc} alt="" className="small-image" />
                                    <button className="delete-image-btn" onClick={handleImageDelete}>Delete Image</button>
                                </div>
                            )}
                        </div>
                        {imageSrc && imageType === 'large' && (
                            <div className="image-wrapper">
                                <img src={imageSrc} alt="" className="large-image" />
                                <button className="delete-image-btn" onClick={handleImageDelete}>Delete Image</button>
                            </div>
                        )}
                        <div className="block-buttons">
                            <button className="move-up-btn" onClick={onMoveUp}>↑</button>
                            <button className="delete-btn" onClick={onRemove}>x</button>
                            <button className="move-down-btn" onClick={onMoveDown}>↓</button>
                        </div>
                        <div className="add-question-buttons">
                            <button onClick={() => onAddQuestion(id, 'textarea')}>Add Open Question</button>
                            <button onClick={() => onAddQuestion(id, 'radios')}>Add Multiple Choice Question</button>
                        </div>
                    </div>
                );
            case 'textarea':
                return (
                    <div className="block-content">
                        <label>Open question:</label>
                        <textarea rows="4" placeholder="Type your question here..." value={content.question || ''} onChange={(e) => onContentChange(id, { ...content, question: e.target.value })}></textarea>
                        <label>Answer:</label>
                        <textarea rows="2" placeholder="Type the correct answer here..." value={content.answer || ''} onChange={(e) => onContentChange(id, { ...content, answer: e.target.value })}></textarea>
                        <div className="block-buttons">
                            <button className="move-up-btn" onClick={onMoveUp}>↑</button>
                            <button className="delete-btn" onClick={onRemove}>x</button>
                            <button className="move-down-btn" onClick={onMoveDown}>↓</button>
                        </div>
                    </div>
                );
            case 'radios':
                return (
                    <div className="block-content">
                        <label>Multiple Choice Question:</label>
                        <input type="text" placeholder="Enter your question here..." value={content.question || ''} onChange={(e) => onContentChange(id, { ...content, question: e.target.value })} />
                        <label>Options:</label>
                        {content.options?.map((option, index) => (
                            <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option || ''} onChange={(e) => {
                                const newOptions = [...content.options];
                                newOptions[index] = e.target.value;
                                onContentChange(id, { ...content, options: newOptions });
                            }} />
                        )) || ['', '', '', ''].map((option, index) => (
                            <input key={index} type="text" placeholder={`Option ${index + 1}`} onChange={(e) => {
                                const newOptions = [...(content.options || ['', '', '', ''])];
                                newOptions[index] = e.target.value;
                                onContentChange(id, { ...content, options: newOptions });
                            }} />
                        ))}
                        <label>Answer:</label>
                        <textarea rows="2" placeholder="Type the correct answer here..." value={content.answer || ''} onChange={(e) => onContentChange(id, { ...content, answer: e.target.value })}></textarea>
                        <div className="block-buttons">
                            <button className="move-up-btn" onClick={onMoveUp}>↑</button>
                            <button className="delete-btn" onClick={onRemove}>x</button>
                            <button className="move-down-btn" onClick={onMoveDown}>↓</button>
                        </div>
                    </div>
                );
            case 'document_file':
                return (
                    <div className="block-content">
                        <label>Upload a document:</label>
                        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                        <div className="block-buttons">
                            <button className="move-up-btn" onClick={onMoveUp}>↑</button>
                            <button className="delete-btn" onClick={onRemove}>x</button>
                            <button className="move-down-btn" onClick={onMoveDown}>↓</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="block">
            {getBlockHTML(type)}
        </div>
    );
};

export default Block;
