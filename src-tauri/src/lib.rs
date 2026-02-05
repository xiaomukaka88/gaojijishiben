pub mod window;

use window::*;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            set_window_opacity,
            set_window_always_on_top,
            set_window_decorations,
            set_window_transparent
        ])
        .setup(|app| {
            #[cfg(desktop)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.set_decorations(true)?;
                window.set_always_on_top(false)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
