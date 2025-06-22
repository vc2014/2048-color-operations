# 2048 Color Operations

A unique twist on the classic 2048 game where tiles perform mathematical operations based on their colors!

## 🎮 How to Play

- **Move tiles** using arrow keys (←↑↓→)
- **Merge tiles** with the same number to perform mathematical operations
- **Reach higher numbers** by strategically combining tiles with different operations
- **Special tiles** have unique behaviors that add strategic depth

## 🎨 Color-Coded Operations

Each tile color represents a different mathematical operation:

- 🔵 **Blue tiles** - Addition (+)
- 🔴 **Red tiles** - Subtraction (−) 
- 🟢 **Green tiles** - Multiplication (×)
- 🟠 **Orange tiles** - Division (÷)
- ⚫ **Gray tiles** - Neutral (default addition)

## ✨ Special Tile Rules

### Tile 1 (Golden)
- **With non-1 tiles**: Can only merge using multiplication or division
- **With other 1s**: Can only merge using addition or subtraction
- Example: `1 × 4 = 4` or `1 + 1 = 2`

### Tile 0 (Faded)
- **Disappears** after being created from operations
- Appears when subtraction results in zero: `2 − 2 = 0` (then vanishes)

## 🎯 Gameplay Features

- **Operation Symbols**: Each tile displays its number and operation symbol
- **Visual Feedback**: Animated popups show the exact calculation when tiles merge
- **Smart Merging**: Only the dominant tile's operation (higher value) is used
- **Dimmed Symbols**: Operation symbols fade when tiles can't merge with neighbors
- **Score Tracking**: Points awarded based on merge results, with best score saved locally

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Use arrow keys to move tiles
3. Watch the operation popups to understand the calculations
4. Try to create high-value tiles through strategic operations!

## 🧠 Strategy Tips

- **Plan ahead**: Look at tile colors and operations before moving
- **Use tile 1 wisely**: It's very versatile for multiplication and division
- **Watch for zeros**: Subtraction can make tiles disappear
- **Color combinations**: Mix different operations for varied results
- **Dominant operations**: Higher-value tiles determine which operation is used

## 🔧 Technical Details

- **Built with**: HTML5, CSS3, JavaScript (ES6+)
- **Responsive design**: Works on desktop and mobile devices
- **Local storage**: Automatically saves your best score
- **Smooth animations**: CSS transitions and keyframe animations
- **Modern browser support**: Uses Flexbox and CSS Grid

## 📝 Version History

- **v0.0.2-SNAPSHOT**: Enhanced tile operations and visual improvements
- **v0.0.1-SNAPSHOT**: Initial implementation with basic color operations

## 🎲 Game Rules Summary

1. **Regular tiles**: Same numbers merge using the dominant tile's operation
2. **Tile 1 + non-1**: Only × or ÷ operations allowed
3. **Tile 1 + tile 1**: Only + or − operations allowed  
4. **Tile 0**: Disappears immediately after creation
5. **Minimum values**: All results are at least 1 (except 0 which vanishes)

---

Enjoy this mathematical twist on the classic sliding puzzle game! 🧮✨