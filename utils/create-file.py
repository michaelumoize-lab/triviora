# file: create-file.py
import os

# -------------------------------
# CONFIGURATION: Define your folder & file structure here
# -------------------------------
# You can add more folders or files as needed
project_structure = {
    "app/api/habits": ["route.ts"],
    "app/api/daily-notes": ["route.ts"],
    "app/api/habits/[id]": ["route.ts"],
    "app/api/habits/[id]/complete": ["route.ts"],
    "app/api/habits/analytics": ["route.ts"],
}

# -------------------------------
# FUNCTION: Creates folders and files
# -------------------------------
def create_project_structure(base_path="."):
    for folder, files in project_structure.items():
        folder_path = os.path.join(base_path, folder)
        # Create folder if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)
        print(f"Created folder: {folder_path}")

        for file in files:
            file_path = os.path.join(folder_path, file)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)  # ← add this
            if not os.path.exists(file_path):
                with open(file_path, "w") as f:
                    f.write("")
                print(f"  Created file: {file_path}")
    else:
        print(f"  File already exists: {file_path}")

# -------------------------------
# MAIN EXECUTION
# -------------------------------
if __name__ == "__main__":
    # Use "." for current directory or specify a path like "C:/Users/YourName/Desktop/project"
    create_project_structure(".")
    print("Project structure created!")
