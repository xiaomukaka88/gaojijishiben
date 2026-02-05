use tauri::{AppHandle, Manager, Result, Window};

#[tauri::command]
pub async fn set_window_opacity(window: Window, opacity: f64) -> Result<()> {
    window.set_opacity(opacity)?;
    Ok(())
}

#[tauri::command]
pub async fn set_window_always_on_top(window: Window, always_on_top: bool) -> Result<()> {
    window.set_always_on_top(always_on_top)?;
    Ok(())
}

#[tauri::command]
pub async fn set_window_decorations(window: Window, decorations: bool) -> Result<()> {
    window.set_decorations(decorations)?;
    Ok(())
}

#[tauri::command]
pub async fn set_window_transparent(window: Window, transparent: bool) -> Result<()> {
    window.set_ignore_cursor_events(!transparent)?;
    Ok(())
}
