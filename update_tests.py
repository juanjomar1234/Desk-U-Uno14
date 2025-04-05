import os

def fix_test_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Reemplazar imports
    content = content.replace(
        "import { describe, it, expect, beforeAll, afterAll } from 'vitest';",
        "import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';"
    )
    content = content.replace(
        "import { PrismaClient } from '@prisma/client';",
        "import { PrismaClient, Prisma } from '@prisma/client';"
    )
    
    # 2. Arreglar tipos de datos
    if "const testUser = {" in content:
        content = content.replace(
            "const testUser = {",
            "const testUser: Prisma.UserCreateInput = {"
        )
        if "role" not in content:
            content = content.replace(
                "name: 'Usuario de Prueba'",
                "name: 'Usuario de Prueba',\n  role: 'USER'"
            )
    
    # 3. Remover 'use client' si existe
    content = content.replace("'use client'\n\n", "")
    
    # 4. Arreglar estructura del test
    lines = []
    for line in content.split('\n'):
        if line.strip() == '}' and lines and lines[-1].strip() == '});':
            continue
        lines.append(line)
    
    content = '\n'.join(lines)
    
    # 5. Asegurarse que describe() está cerrado correctamente
    if "describe(" in content and not content.strip().endswith("});"):
        content = content.rstrip()
        while content.endswith("}"):
            content = content[:-1].rstrip()
        content += "\n});\n"

    with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

def main():
    test_dir = 'tests/services'
    for file in os.listdir(test_dir):
        if file.endswith('.test.ts'):
            file_path = os.path.join(test_dir, file)
            print(f'Updating {file}...')
            fix_test_file(file_path)

def update_test_files():
    tests_dir = 'tests'
    
    for root, dirs, files in os.walk(tests_dir):
        for file in files:
            if file.endswith('.test.ts'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Añadir jest al import de @jest/globals
                content = content.replace(
                    "import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';",
                    "import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';"
                )
                
                # Añadir el mock de node-fetch si no existe
                if "jest.mock('node-fetch')" not in content:
                    import_lines = []
                    other_lines = []
                    
                    for line in content.split('\n'):
                        if line.startswith('import '):
                            import_lines.append(line)
                        else:
                            other_lines.append(line)
                    
                    import_lines.append('\n// Asegurarnos que fetch está mockeado')
                    import_lines.append("jest.mock('node-fetch');")
                    
                    new_content = '\n'.join(import_lines + [''] + other_lines)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f'Updated {file_path}')

if __name__ == '__main__':
    main()
    update_test_files() 