function addElement() {
    const fields = [
        { id: 'elementId', name: 'Element ID' },
        { id: 'elementType', name: 'Element Type' },
        { id: 'elementWidth', name: 'Element Width' },
        { id: 'elementHeight', name: 'Element Height' },
        { id: 'elementContent', name: 'Element Content' },
        { id: 'fontColor', name: 'Font Color' },
        { id: 'bgColor', name: 'Background Color' },
        { id: 'fontSize', name: 'Font Size' },
        { id: 'fontType', name: 'Font Type' },
        { id: 'borderColor', name: 'Border Color' },
        { id: 'borderStyle', name: 'Border Style' },
        { id: 'borderThickness', name: 'Border Thickness' },
        { id: 'padding', name: 'Padding' },
        { id: 'margin', name: 'Margin' },
        { id: 'shadowX', name: 'Shadow X' },
        { id: 'shadowY', name: 'Shadow Y' },
        { id: 'borderRadius', name: 'Border Radius' }
    ];

    for (let field of fields) {
        const value = document.getElementById(field.id).value.trim();
        if (!value) {
            showPopup(`You left the ${field.name} field empty!`);
            return;
        }
    }

    const elementId = document.getElementById('elementId').value.trim();
    const elementType = document.getElementById('elementType').value.trim();
    const elementWidth = document.getElementById('elementWidth').value.trim();
    const elementHeight = document.getElementById('elementHeight').value.trim();
    const elementContent = document.getElementById('elementContent').value.trim();
    const fontColor = document.getElementById('fontColor').value.trim();
    const bgColor = document.getElementById('bgColor').value.trim();
    const fontSize = document.getElementById('fontSize').value.trim();
    const fontType = document.getElementById('fontType').value.trim();
    const borderColor = document.getElementById('borderColor').value.trim();
    const borderStyle = document.getElementById('borderStyle').value.trim();
    const borderThickness = document.getElementById('borderThickness').value.trim();
    const padding = document.getElementById('padding').value.trim();
    const margin = document.getElementById('margin').value.trim();
    const shadowX = document.getElementById('shadowX').value.trim();
    const shadowY = document.getElementById('shadowY').value.trim();
    const borderRadius = document.getElementById('borderRadius').value.trim();

    // Create the new element
    const newElement = document.createElement(elementType);
    if (elementId) newElement.id = elementId; // Set the ID attribute if provided
    newElement.style.width = elementWidth ? `${elementWidth}px` : 'auto';
    newElement.style.height = elementHeight ? `${elementHeight}px` : 'auto';
    newElement.style.color = fontColor;
    newElement.style.backgroundColor = bgColor;
    newElement.style.fontSize = `${fontSize}px`;
    newElement.style.fontFamily = fontType;
    newElement.textContent = elementContent;

    // Set border properties
    newElement.style.border = `${borderThickness}px ${borderStyle} ${borderColor}`;

    // Set padding and margin properties
    newElement.style.padding = padding ? `${padding}px` : '0px';
    newElement.style.margin = margin ? `${margin}px` : '0px';

    // Set shadow properties
    newElement.style.boxShadow = `${shadowX}px ${shadowY}px 5px rgba(0, 0, 0, 0.5)`;

    // Set border radius
    newElement.style.borderRadius = borderRadius ? `${borderRadius}px` : '0px';

    // Append the new element to the container
    document.getElementById('container').appendChild(newElement);

    // Automatically save after adding an element
    saveElements();
}

// Function to save the elements in the container to localStorage
function saveElements() {
    const container = document.getElementById('container');
    localStorage.setItem('savedElements', container.innerHTML);
    alert('אלמנטים נשמרו!');
}
// Function to load saved elements from localStorage
function loadSavedElements() {
    const savedElements = localStorage.getItem('savedElements');
    if (savedElements) {
        document.getElementById('container').innerHTML = savedElements;
    }
}
// Function to clear the screen and localStorage
function clearScreen() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    sessionStorage.clear('container');
    alert('המסך נוקה בהצלחה!');
}

function showPopup(message) {
    const popup = document.getElementById('popupMessage');
    const popupText = document.getElementById('popupText');
    popupText.textContent = message;
    popup.style.display = 'flex';
    setTimeout(() => {
        closePopup();
    }, 2000);
}

function closePopup() {
    const popup = document.getElementById('popupMessage');
    popup.style.display = 'none';
}

