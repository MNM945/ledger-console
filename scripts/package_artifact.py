from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
output = root / 'release' / 'ledger-console.zip'
output.parent.mkdir(exist_ok=True)
excluded = {'docs/JD_COVERAGE.md'}
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for folder in ['.storybook', 'src', 'tokens', 'scripts', 'docs', 'dist']:
        for path in sorted((root / folder).rglob('*')):
            if not path.is_file() or '__pycache__' in path.parts:
                continue
            relative = path.relative_to(root).as_posix()
            if relative in excluded or relative.startswith('docs/source/') or '/shell-' in relative:
                continue
            archive.write(path, Path('ledger-console') / path.relative_to(root))
    for name in ['.gitignore', 'README.md', 'package.json', 'package-lock.json', 'index.html', 'Ledger Console.html', 'tsconfig.json', 'vite.config.ts', 'Start Preview.bat', 'Start Storybook.bat']:
        archive.write(root / name, Path('ledger-console') / name)
with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'ledger-console/Ledger Console.html' in archive.namelist()
    assert not any('/node_modules/' in name or '/.git/' in name or 'ShellApp' in name for name in archive.namelist())
    print(f'{output}: {len(archive.namelist())} files; integrity passed')
