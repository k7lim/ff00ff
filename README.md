# HexVex 🎨

A web-based hex color quiz game that challenges your color knowledge through interactive gameplay. Test your ability to identify hex color codes and their corresponding color swatches in this infinite quiz experience.

## 🎮 Game Overview

HexVex presents an endless series of color identification challenges with two alternating question types:

**Type 1: Identify Color** 🎯  
- See a large color swatch
- Choose the correct hex code from four options
- Example: See a fuchsia swatch, pick `#FF00FF`

**Type 2: Identify Swatch** 🌈  
- See a large hex code
- Choose the matching color swatch from four options  
- Example: See `#FF00FF`, pick the fuchsia swatch

## ✨ Features

### 🎯 Smart Color Generation
- All colors generated randomly from the full hex spectrum (`#000000` to `#FFFFFF`)
- Advanced distinctness algorithm ensures options are visually different
- Uses color distance calculation to prevent similar colors: `Distance = |R1-R2| + |G1-G2| + |B1-B2|`
- Regenerates options if any pair is too similar (distance < 75)

### 💡 Educational Hint System
- **Show Hint** button reveals RGB component breakdown
- Hex codes get colored backgrounds showing red, green, and blue components
- Example: `#AABBCC` shows `AA` with red background, `BB` with green, `CC` with blue
- Helps users learn how hex codes represent RGB values

### 🏆 Dynamic Scoring System
- **First try**: 8 points (4 with hint)
- **Second try**: 4 points (2 with hint)  
- **Third try**: 2 points (1 with hint)
- **Fourth try**: 0 points
- Real-time scoring preview shows potential points during gameplay
- Educational hex breakdown displayed when rounds end

### 🎨 Font Customization
- Discrete font switcher in bottom-left corner
- Choose between:
  - **Default**: Clean Arial/monospace fonts
  - **Rubik Wet Paint**: Fun paint-drip style
  - **Caveat**: Handwritten aesthetic

### 🎓 Educational Features
- **Scoring Preview**: Shows potential points for next guess in real-time
- **Hex Breakdown**: Displays RGB component analysis after each round
- **Progressive Difficulty**: Learn through immediate visual feedback

## 🚀 Getting Started

### Quick Start
1. Clone the repository
2. Open `index.html` in any modern web browser
3. Start playing immediately - no setup required!

### Local Development
```bash
git clone https://github.com/your-username/hexvex.git
cd hexvex
open index.html
```

## 🛠️ Technical Details

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Google Fonts integration (Rubik Wet Paint, Caveat)
- **Architecture**: Modular JavaScript with clean separation of concerns

### File Structure
```
hexvex/
├── index.html          # Main game interface
├── style.css           # All styling and responsive design
├── app.js             # UI rendering and interaction management
├── game.js            # Core game logic and state management
├── utils.js           # Utility functions for color calculations
├── tests/             # Comprehensive test suites
│   ├── test-runner.html
│   ├── utils.test.js
│   ├── game.test.js
│   ├── app.test.js
│   ├── e2e.test.js
│   ├── performance.test.js
│   └── spec-compliance.test.js
└── README.md
```

### Code Architecture

**`utils.js`** - Color Mathematics
- Hex/RGB conversion functions
- Color distance calculations
- Random color generation
- Input validation and sanitization

**`game.js`** - Game Logic
- Question generation and validation
- Scoring system implementation
- Color distinctness algorithms
- Game state management

**`app.js`** - User Interface
- DOM manipulation and event handling
- Visual rendering (swatches, hex codes, hints)
- User interaction processing
- Font switching functionality

## 🧪 Testing

### Running Tests
Open `tests/test-runner.html` in your browser to run the comprehensive test suite including:

- **Unit Tests**: Color calculations, scoring logic, question generation
- **Integration Tests**: Game flow, hint system, scoring integration
- **End-to-End Tests**: Complete gameplay scenarios
- **Performance Tests**: Color generation efficiency, memory usage
- **Spec Compliance Tests**: Adherence to game specifications

### Test Coverage
- ✅ Color distance calculations
- ✅ Distinctness algorithm validation
- ✅ Scoring system accuracy
- ✅ Hint functionality
- ✅ UI state management
- ✅ Font switching
- ✅ Educational features

## 🎯 Gameplay Mechanics

### Scoring Strategy
- **Early accuracy**: Maximum points for first-try success
- **Hint trade-off**: Use hints to learn but sacrifice points
- **Progressive learning**: Hex breakdown teaches color composition

### Educational Value
- **Color theory**: Learn RGB component relationships
- **Hex notation**: Understand hexadecimal color representation
- **Visual training**: Develop color recognition skills
- **Strategic thinking**: Balance learning aids vs. scoring

## 🔧 Development

### Code Style
- Clean, readable vanilla JavaScript
- Comprehensive error handling and validation
- Detailed logging for debugging
- Modular architecture with clear separation of concerns

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No external dependencies required
- Responsive design for various screen sizes

### Performance
- Efficient color generation algorithms
- Optimized DOM manipulation
- Minimal memory footprint
- Smooth 60fps interactions

## 🎨 Visual Design

### Design Philosophy
- **Minimalist**: Clean white background lets colors shine
- **Accessibility**: High contrast, readable fonts, clear interactions
- **Focus**: Colors are the dominant visual element
- **Clarity**: Obvious interaction patterns and feedback

### Visual Elements
- **Color Swatches**: Large circles with subtle shadows
- **Hex Codes**: Prominent monospace font with text shadows
- **Buttons**: Clean design with hover effects
- **Scoring**: Discrete but visible progress tracking

## 🚀 Future Enhancements

### Potential Features
- **Difficulty Levels**: Adjustable color similarity thresholds
- **Statistics**: Track accuracy, learning progress, streaks
- **Color Palettes**: Focus on specific color families
- **Multiplayer**: Compete with friends in real-time
- **Mobile App**: Native iOS/Android versions

### Technical Improvements
- **PWA Support**: Offline play capabilities
- **Performance**: Advanced optimization for extended sessions
- **Accessibility**: Enhanced screen reader support
- **Analytics**: Optional usage tracking for improvement insights

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the test suite
5. Submit a pull request

---

**HexVex** - Where color knowledge meets interactive learning! 🌈✨