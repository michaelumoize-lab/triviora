# file: create-file.py
import os

# -------------------------------
# CONFIGURATION: Define your folder & file structure here
# -------------------------------
# You can add more folders or files as needed
project_structure = {
    "components": ["auth/sign-in-form.tsx", "auth/sign-up-form.tsx"],
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
            # Create empty file if it doesn't exist
            if not os.path.exists(file_path):
                with open(file_path, "w") as f:
                    f.write("")  # leave empty or put default content
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
