# Library Settings Button - Manage Librarians

## Overview
Added a **"Manage Librarians"** button directly on the Library Dashboard page. This allows admins to quickly add or remove librarians without navigating to the main Settings page.

## Visual Location

```
┌────────────────────────────────────────────────────────────────┐
│  Library Management                                             │
│                                                                 │
│  [⚙️ Manage Librarians] [+ Add Book] [Issue Book] [Return Book]│
│   ↑ NEW BUTTON!                                                │
│                                                                 │
│  🔍 Search...                                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Book Title    │ Author      │ ISBN    │ Status           │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Features

### 1. Manage Librarians Button
- **Location**: Top right of Library Dashboard, before "Add Book" button
- **Icon**: Settings gear icon (⚙️)
- **Color**: Gray background
- **Visibility**: Only visible to ADMIN and SUPER_ADMIN roles
- **Action**: Opens librarian management modal

### 2. Manage Librarians Modal
When you click the button, a modal opens showing:

```
┌─────────────────────────────────────────────────┐
│  Manage Librarians                          [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  [+ Add New Librarian]                         │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Name      │ Email           │ Status │ 🗑️ │ │
│  ├───────────────────────────────────────────┤ │
│  │ John Doe  │ john@lib.com    │ Active │ 🗑️ │ │
│  │ Jane Smith│ jane@lib.com    │ Active │ 🗑️ │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Features:**
- View all librarians in a table
- See name, email, and status (Active/Inactive)
- Delete button (trash icon) for each librarian
- "Add New Librarian" button at the top

### 3. Add New Librarian Modal
Click "Add New Librarian" to open the creation form:

```
┌─────────────────────────────────────────────────┐
│  Add New Librarian                          [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  First Name:  [________________]               │
│  Last Name:   [________________]               │
│  Email:       [________________]               │
│  Password:    [________________]               │
│                                                 │
│  ℹ️ The librarian will have access to          │
│     library management features only.          │
│                                                 │
│              [Cancel] [Create Librarian]       │
└─────────────────────────────────────────────────┘
```

## How to Use

### As Admin:

#### Step 1: Access Library Dashboard
1. Login as ADMIN or SUPER_ADMIN
2. Click "Library" in the sidebar
3. You'll see the Library Dashboard

#### Step 2: Open Librarian Management
1. Look at the top right buttons
2. Click **"⚙️ Manage Librarians"** (gray button)
3. Modal opens showing all librarians

#### Step 3: Add a New Librarian
1. In the modal, click **"+ Add New Librarian"**
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Librarian`
   - Email: `john.lib@huroorkee.ac.in`
   - Password: `password123` (minimum 8 characters)
3. Click **"Create Librarian"**
4. Success message appears
5. New librarian appears in the table

#### Step 4: Remove a Librarian
1. In the librarians table, find the librarian to remove
2. Click the **trash icon (🗑️)** in the Actions column
3. Confirm deletion in the popup
4. Librarian is removed (soft delete)
5. Success message appears

#### Step 5: Close Modal
- Click the **X** button in the top right
- Or click outside the modal
- Returns to Library Dashboard

### As Librarian:
- **Cannot see** the "Manage Librarians" button
- Only admins can manage librarians
- Librarians can only use library features (add/issue/return books)

## Access Control

| Role         | Can See Button? | Can Add Librarians? | Can Remove Librarians? |
|--------------|-----------------|---------------------|------------------------|
| ADMIN        | ✅ Yes          | ✅ Yes              | ✅ Yes                 |
| SUPER_ADMIN  | ✅ Yes          | ✅ Yes              | ✅ Yes                 |
| LIBRARIAN    | ❌ No           | ❌ No               | ❌ No                  |

## Button Appearance

### For Admins:
```
[⚙️ Manage Librarians] [+ Add Book] [Issue Book] [Return Book]
 ↑ Gray button with settings icon
```

### For Librarians:
```
[+ Add Book] [Issue Book] [Return Book]
 ↑ No "Manage Librarians" button visible
```

## Technical Details

### State Management
- `showLibrarianModal` - Controls main librarian management modal
- `showAddLibrarianModal` - Controls add librarian form modal
- `isAdmin` - Checks if user is ADMIN or SUPER_ADMIN

### API Endpoints Used
- `GET /api/v1/auth/users?role=LIBRARIAN` - Fetch all librarians
- `POST /api/v1/auth/register` - Create new librarian
- `DELETE /api/v1/auth/users/:id` - Remove librarian (soft delete)

### Features
- Real-time updates after add/remove operations
- Confirmation dialog before deletion
- Loading states on buttons during operations
- Success/error toast notifications
- Responsive modal design

## Workflow Example

### Scenario: Admin needs to add a librarian quickly

**Before (Old Way):**
1. Go to Library Dashboard
2. Navigate back to admin sidebar
3. Click Settings
4. Click "Librarian Management" tab
5. Add librarian
6. Navigate back to Library

**After (New Way):**
1. Go to Library Dashboard
2. Click "⚙️ Manage Librarians" button
3. Click "Add New Librarian"
4. Fill form and submit
5. Done! Stay on Library Dashboard

**Time Saved:** ~5 clicks and navigation steps!

## Benefits

✅ **Quick Access**: Manage librarians without leaving library page
✅ **Convenient**: All library management in one place
✅ **Efficient**: Fewer clicks and navigation
✅ **Secure**: Only admins can see and use the button
✅ **User-Friendly**: Clear icons and labels
✅ **Real-time**: Immediate updates after changes

## Testing

### Test 1: Admin Can See Button
1. Login as admin
2. Go to Library Dashboard
3. ✅ Should see "Manage Librarians" button

### Test 2: Librarian Cannot See Button
1. Login as librarian
2. Go to Library Dashboard
3. ✅ Should NOT see "Manage Librarians" button

### Test 3: Add Librarian
1. Click "Manage Librarians"
2. Click "Add New Librarian"
3. Fill form and submit
4. ✅ Librarian created and appears in table

### Test 4: Remove Librarian
1. Click "Manage Librarians"
2. Click trash icon next to a librarian
3. Confirm deletion
4. ✅ Librarian removed from table

### Test 5: Modal Closes Properly
1. Open "Manage Librarians" modal
2. Click X or outside modal
3. ✅ Modal closes and returns to dashboard

## Troubleshooting

### Issue: Button not visible
**Solution**: 
- Make sure you're logged in as ADMIN or SUPER_ADMIN
- Librarians cannot see this button
- Hard refresh (Ctrl+Shift+R)

### Issue: Modal shows no librarians
**Solution**:
- No librarians exist yet - add one!
- Check backend is running
- Check browser console for errors

### Issue: Cannot delete librarian
**Solution**:
- Cannot delete yourself
- Check you have admin permissions
- Verify backend is running

## Summary

✅ Added "Manage Librarians" button on Library Dashboard
✅ Only visible to admins
✅ Opens modal with librarian list
✅ Can add new librarians
✅ Can remove existing librarians
✅ All operations work in real-time
✅ No need to navigate to Settings page
✅ Convenient and efficient workflow
