# Product Requirements Document (PRD) - uyuk

## 1. Product Overview
uyuk is a multi-user habit tracking web application inspired by HabitKit. It focuses on visual progress through colorful grid heatmaps and a streamlined table interface for rapid daily logging. The app provides a responsive experience across desktop and mobile devices, ensuring users can track their habits anywhere.

### Core Value Proposition
- Visual Motivation: High-density color grids provide immediate feedback on consistency.
- Flexible Tracking: Supports both simple completion (boolean) and quantity-based (numeric) habits.
- Cross-Device Sync: Real-time data synchronization across all user devices.

## 2. Target Audience
- Individuals seeking to build new routines or break old ones.
- Visual-oriented users who find satisfaction in "filling the grid."
- Users who need a simple, fast interface for multiple daily check-ins.

## 3. User Stories [v1]
- As a user, I want to create a new habit with a specific name, icon, and color so I can personalize my tracking experience.
- As a user, I want to choose between boolean and numeric habit types so I can track different kinds of goals (e.g., "Gym" vs "Water intake").
- As a user, I want to log multiple completions for a single boolean habit per day so I can track habits that happen multiple times (e.g., "Brush teeth" 2x/day).
- As a user, I want to see a spreadsheet-like table view of my habits so I can quickly log data for today and past days.
- As a user, I want to view a 1-month color intensity grid for each habit so I can visualize my consistency over time.
- As a user, I want to see a combined neutral grid that aggregates my performance across all habits.
- As a user, I want to reorder my habits via drag-and-drop so I can prioritize what matters most.
- As a user, I want to sign in with my Google account so I don't have to manage another password.
- As a user, I want to archive habits I am no longer actively tracking without losing my historical data.
- As a user, I want to configure whether my week starts on Sunday or Monday to match my personal preference.

## 4. Functional Requirements

### 4.1 Authentication and Account
- [v1] Integration with Convex Auth and Google OAuth for secure sign-in.
- [v1] User data isolation: Users can only see and modify their own data.
- [v1] Persistent sessions: Users remain logged in across browser restarts.
- [v1] Sign out functionality located within the Settings screen.

### 4.2 Habit Management
- [v1] **Creation/Editing**:
    - Name: Required string.
    - Description: Optional string.
    - Icon: Selection from an icon library or emoji picker.
    - Color: Choice from a curated palette of 12 colors or a custom hex picker.
    - Type: Boolean (Check-off) or Numeric (Value-based).
    - Goal:
        - For Boolean: Number of required "taps" to complete the day (minimum 1).
        - For Numeric: Target numeric value per day (must be > 0).
- [v1] **Ordering**: Manual drag-and-drop reordering in the Table View.
- [v1] **Archiving**: Habits can be moved to an "Archived" state. They disappear from active views but retain all historical data.
- [v1] **Soft Delete**: Habits can be marked as deleted. Deleted habits are hidden but not removed from the database, allowing for future restoration.

**Note**: v1 supports **daily frequency only**. Habits are tracked once per calendar day. Custom frequencies (specific weekdays, intervals) are planned for a future release.

### 4.3 Table View (Primary Interface)
- [v1] **Layout**: A responsive grid where rows represent habits and columns represent days.
- [v1] **Navigation**: Ability to scroll horizontally to view past days.
- [v1] **Interaction**:
    - Boolean: Tapping a cell increments the completion count. Visual fill state updates based on completion/goal ratio (e.g., 1/3 filled).
    - Numeric: Tapping a cell opens a quick-input dialog to enter or update the current value.
- [v1] **Backfilling**: Users can interact with any visible past day cell to record data.
- [v1] **Visuals**: Today's column is visually highlighted.

### 4.4 Grids View (Visualization)
- [v1] **Habit Grids**: Each active habit displays a 1-month heatmap.
- [v1] **Intensity**: Cell color intensity corresponds to the completion percentage for that day (0% to 100%).
- [v1] **Styling**: Solid squares with no gaps between cells and no border-radius.
- [v1] **Combined Grid**: A prominent, neutral-colored (e.g., white/grey) grid at the top showing the average completion percentage across all habits for each day.

### 4.5 Statistics
- [v1] **Current Streak**: Number of consecutive days the habit goal was met, ending today or yesterday.
- [v1] **Longest Streak**: The historical maximum streak achieved for the habit.
- [v1] **Total Completions**: Cumulative count of all successful completions/values recorded.
- [v1] **Completion Rate**: Percentage of days the goal was met since the habit's creation date.
- [v1] **Placement**: Displayed within the habit row in Table View (desktop) or under the habit grid in Grids View.

### 4.6 Settings
- [v1] **Week Start**: Toggle between Monday and Sunday for all calendar/grid views.
- [v1] **Display Name**: Ability to update the user's name shown in the app.
- [v1] **Timezone**: Manual timezone selection to ensure "Today" aligns with the user's local time.
- [v1] **Habit Management**: A list view to manage (unarchive/restore) archived or deleted habits.

## 5. Feature Acceptance Criteria

### Habit Creation
- **Given** I am on the habit creation screen
- **When** I enter a name and select a color
- **And** I set the type to Boolean with 3 completions per day
- **Then** the habit should be saved and appear in my Table View
- **And** it should require 3 taps to reach 100% completion for any given day

### Table View Logging
- **Given** a Boolean habit with a goal of 2
- **When** I tap the cell for today once
- **Then** the cell should show a 50% fill state
- **When** I tap it again
- **Then** the cell should show a 100% fill state (completed)

### Grid Visualization
- **Given** a habit with a blue color
- **When** I complete 50% of the goal for a specific day
- **Then** the corresponding cell in the Grids view should show the blue color at 50% opacity/intensity
- **And** there should be no visible gap between that cell and its neighbors

## 6. Non-Functional Requirements
- **Responsiveness**: The UI must adapt seamlessly from 320px (mobile) to 2560px (ultra-wide desktop).
- **Performance**: The Grids view must remain performant (60fps scrolling) even with 50+ habits and a full year of data.
- **Real-time Sync**: Changes made on one device (e.g., phone) must reflect on another (e.g., desktop) within 500ms via Convex.
- **Accessibility**: Support keyboard navigation for common actions and maintain a minimum WCAG 2.1 AA color contrast ratio.

## 7. Future Roadmap [Future]
- **Theming**: Light mode support (v1 ships dark-first).
- **Categories**: Grouping habits by tags (e.g., "Health", "Work").
- **Flexible Frequency**: Support for specific days of the week (e.g., "Mon, Wed, Fri") or custom intervals.
- **Advanced Grids**: Switchable time ranges for heatmaps (3 months, 6 months, 1 year).
- **Habit Details**: Dedicated screen with detailed history logs, notes, and advanced charts.
- **Notifications**: Push notifications for daily reminders and streak freezes.
- **Data Portability**: Export habit data in CSV or JSON format.
- **Offline Support**: Optimistic UI updates with a background sync queue for intermittent connectivity.
- **Templates**: Pre-defined habit suggestions for quick setup.
