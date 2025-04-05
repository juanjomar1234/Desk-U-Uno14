import os
from pathlib import Path

def generate_tree(startpath, exclude_dirs=None, exclude_files=None):
    if exclude_dirs is None:
        exclude_dirs = ['old', 'node_modules', '.git', '.next', '__pycache__']
    if exclude_files is None:
        exclude_files = ['.gitignore', 'tree.py', 'tree.txt']
    
    tree = []
    
    for root, dirs, files in os.walk(startpath):
        # Excluir directorios no deseados
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level)
        tree.append(f'{indent}{"└───" if level else ""}{os.path.basename(root)}/')
        
        subindent = '│   ' * (level + 1)
        for f in sorted(files):
            if f not in exclude_files:
                tree.append(f'{subindent}└── {f}')
    
    return '\n'.join(tree)

def main():
    # Obtener el directorio actual
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generar el árbol
    tree_content = generate_tree(current_dir)
    
    # Escribir en tree.txt
    with open('tree.txt', 'w', encoding='utf-8') as f:
        f.write(tree_content)

if __name__ == '__main__':
    main() 