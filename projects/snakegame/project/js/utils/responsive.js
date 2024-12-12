export function calculateGameDimensions() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth - 40; // Padding consideration
    const windowHeight = window.innerHeight;
    
    // Calculate optimal dimensions while maintaining aspect ratio
    const maxHeight = Math.min(windowHeight * 0.6, 400);
    const maxWidth = Math.min(containerWidth, 800);
    
    // Ensure cell size is optimal for different screen sizes
    const cellSize = containerWidth < 600 ? 15 : 20;
    
    // Calculate grid dimensions
    const cols = Math.floor(maxWidth / cellSize);
    const rows = Math.floor(maxHeight / cellSize);
    
    return {
        width: cols * cellSize,
        height: rows * cellSize,
        cellSize
    };
}