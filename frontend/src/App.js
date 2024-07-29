import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Block from './components/Block';
import './styles/Styles.css';
import { saveAs } from 'file-saver';
import yaml from 'js-yaml';

function App() {
    const [blocks, setBlocks] = useState([]);
    const [formData, setFormData] = useState({
        topic: '',
        audience: '',
        objectives: ''
    });

    const addBlock = (type, content = {}) => {
        const newBlock = { id: Date.now(), type, content };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const moveBlock = (id, direction) => {
        const index = blocks.findIndex(block => block.id === id);
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(index + direction, 0, movedBlock);
        setBlocks(newBlocks);
    };

    const handleContentChange = (id, content) => {
        setBlocks(blocks.map(block => (block.id === id ? { ...block, content } : block)));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const generateLesson = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/generate_lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.sections) {
                const newBlocks = data.sections.map((section, index) => ({
                    id: Date.now() + index,
                    type: 'template_text_image_right',
                    content: { text: section, image: '' }
                }));
                setBlocks(newBlocks);
            }
        } catch (error) {
            console.error('Error generating lesson:', error);
        }
    };

    const addQuestion = async (id, questionType) => {
        const block = blocks.find(block => block.id === id);
        const text = block.content.text;
        try {
            const response = await fetch('http://127.0.0.1:5000/generate_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, questionType })
            });
            const data = await response.json();
            if (data.question) {
                const { question, options, answer } = data;
                const questionBlock = {
                    id: Date.now(),
                    type: questionType,
                    content: { question, options, answer }
                };
                const index = blocks.findIndex(block => block.id === id);
                const newBlocks = [...blocks];
                newBlocks.splice(index + 1, 0, questionBlock);
                setBlocks(newBlocks);
            }
        } catch (error) {
            console.error('Error generating question:', error);
        }
    };

    const exportToYaml = () => {
        const yamlBlocks = blocks.map(block => {
            const uniqueId = `block_${block.id}`;
            let yamlBlock = {
                '#type': 'processed_text',
                '#title': 'tekst',
                '#format': 'webform_html'
            };
    
            if (block.type === 'template_text_image_right') {
                const imageType = block.content.imageType;
                const imageUuid = 'unique_image_id'; // Replace with actual unique image ID logic
                if (block.content.image) {
                    yamlBlock['#text'] = imageType === 'small' ?
                        `<table><tbody><tr><td><drupal-media data-align="center" data-entity-type="media" data-entity-uuid="${imageUuid}" data-view-mode="small_width_no_caption"></drupal-media></td><td>${block.content.text}</td></tr></tbody></table>` :
                        `<p>${block.content.text}</p><p>&nbsp;</p><drupal-media data-align="center" data-entity-type="media" data-entity-uuid="${imageUuid}"></drupal-media>`;
                } else {
                    yamlBlock['#text'] = block.content.text;
                }
            } else if (block.type === 'document_file') {
                yamlBlock = {
                    '#type': 'document_file',
                    '#title': 'Instruction', // Replace with actual instruction
                    '#elo_max_score': 0
                };
            } else if (block.type === 'radios') {
                yamlBlock = {
                    '#type': 'radios',
                    '#title': block.content.question,
                    '#elo_answer_direction': `<p>${block.content.answer}</p>`,
                    '#options': block.content.options.reduce((acc, option, index) => {
                        acc[`value_${index + 1}`] = option;
                        return acc;
                    }, {})
                };
            } else if (block.type === 'textarea') {
                yamlBlock = {
                    '#type': 'textarea',
                    '#title': block.content.question,
                    '#elo_answer_direction': `<p>${block.content.answer}</p>`,
                    '#elo_max_score': 0
                };
            }
    
            return { [uniqueId]: yamlBlock };
        });
    
        let yamlString = yaml.dump(yamlBlocks.filter(Boolean), {
            styles: {
                '!!null': 'canonical' // Ensure null values are represented as ~
            },
            lineWidth: -1 // Ensure no line wrapping
        });
    
        // Adjust the text field format
        yamlString = yamlString.replace(/#text: '(.+?)'/g, (match, p1) => {
            const formattedText = p1.split('\n').map(line => `    ${line}`).join('\n');
            return `#text: |\n    ${formattedText}`;
        });
    
        // Ensure proper formatting for text field with multi-line content
        yamlString = yamlString.replace(/#text: \|[ ]*\n[ ]*(<.+?>)/g, '#text: |\n    $1');
    
        // Remove leading hyphens from block identifiers
        yamlString = yamlString.replace(/- block_/g, 'block_');
    
        const blob = new Blob([yamlString], { type: 'text/yaml' });
        saveAs(blob, 'lesson.yaml');
    };    
    
    return (
        <div id="container">
            <div id="sidebar">
                <h2>Create Lesson</h2>
                <input
                    type="text"
                    name="topic"
                    placeholder="Lesson Topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="audience"
                    placeholder="Target Audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                />
                <textarea
                    name="objectives"
                    placeholder="Learning Objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                ></textarea>
                <button onClick={generateLesson}>Generate Lesson</button>
                <Sidebar addBlock={addBlock} />
                <button id="export-button" onClick={exportToYaml}>Export</button>
            </div>
            <div id="content-area">
                {blocks.map(block => (
                    <Block
                        key={block.id}
                        id={block.id}
                        type={block.type}
                        content={block.content}
                        onRemove={() => removeBlock(block.id)}
                        onMoveUp={() => moveBlock(block.id, -1)}
                        onMoveDown={() => moveBlock(block.id, 1)}
                        onContentChange={handleContentChange}
                        onAddQuestion={addQuestion}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
