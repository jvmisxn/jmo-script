use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptProject {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub document_type: String,
    pub created_at: String,
    pub updated_at: String,
    pub elements: Vec<ScriptElement>,
    pub metadata: ScriptMeta,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptElement {
    pub id: String,
    #[serde(rename = "type")]
    pub element_type: String,
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scene_number: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptMeta {
    pub author: Option<String>,
    pub contact: Option<String>,
    pub copyright: Option<String>,
    pub notes: Option<String>,
    pub draft_date: Option<String>,
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

#[tauri::command]
async fn save_project(path: String, project: ScriptProject) -> Result<(), String> {
    let json = serde_json::to_string_pretty(&project).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_project(path: String) -> Result<ScriptProject, String> {
    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let project: ScriptProject = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(project)
}

#[tauri::command]
async fn list_projects(directory: String) -> Result<Vec<String>, String> {
    let dir = PathBuf::from(&directory);
    if !dir.exists() {
        return Ok(vec![]);
    }

    let mut projects = Vec::new();
    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.extension().map_or(false, |ext| ext == "jmoscript") {
            projects.push(path.to_string_lossy().to_string());
        }
    }

    Ok(projects)
}

#[tauri::command]
async fn export_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| e.to_string())?;
    Ok(())
}

// ---------------------------------------------------------------------------
// App Runner
// ---------------------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            save_project,
            load_project,
            list_projects,
            export_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running JMO Script");
}
