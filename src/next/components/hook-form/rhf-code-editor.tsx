import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Editor, { useMonaco } from '@monaco-editor/react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { Card, useTheme } from '@mui/material';

type RHFMonacoCodeEditorProps = {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    height?: number | string;
    disabled?: boolean;
    /**
     * Default is Bash/shell.
     * Monaco language ids must be installed/bundled; 'shell' ships with monaco.
     */
    language?: string;
};

export function RHFMonacoCodeEditor({
    name,
    label,
    helperText,
    height = 313,
    disabled,
    language = 'shell',
}: RHFMonacoCodeEditorProps) {
    const { control } = useFormContext();
    const theme = useTheme();
    const monaco = useMonaco();

    // Create a theme with the requested coloring
    React.useEffect(() => {
        if (!monaco) return;

        monaco.editor.defineTheme('bashTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // comments -> dark gray
                { token: 'comment', foreground: '6b7280' }, // tailwind gray-500
                // keywords -> green
                { token: 'keyword', foreground: '22c55e', fontStyle: 'bold' }, // green-500
                // function names (identifiers after 'function' or tokens tagged as function)
                { token: 'function', foreground: '16a34a' }, // green-600
                { token: 'identifier.function', foreground: '16a34a' },
                // strings -> warm yellow
                { token: 'string', foreground: 'eab308' }, // yellow-500
                // numbers -> light blue
                { token: 'number', foreground: '60a5fa' }, // blue-400
                // variables like $FOO -> cyan-ish
                { token: 'variable', foreground: '06b6d4' }, // cyan-500
                // shebang
                { token: 'metatag', foreground: 'a78bfa' }, // violet-400
            ],
            colors: {
                'editor.background': '#12182400',
                'editorLineNumber.foreground': '#6b7280',
                'editorLineNumber.activeForeground': '#04690cff',
                'editorCursor.foreground': theme.palette.success.main,
                'editor.lineHighlightBackground': '#11182755',
                'editorIndentGuide.background': '#374151',
                'editorIndentGuide.activeBackground': '#6b7280',

            },

        });
        monaco.editor.setTheme('bashTheme');
    }, [monaco, theme.palette.mode]);

    const h = typeof height === 'number' ? `${height}px` : height
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Box sx={{ width: '100%' }}>
                    {label && (
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {label}
                        </Typography>
                    )}

                    <Box
                        component={Card}
                        className='glassy'
                        sx={{
                            position: 'relative',
                            border: 1,
                            borderRadius: 1,
                            borderColor: error ? 'error.main' : 'divider',
                            borderWidth: error ? '2px' : '0px',
                            overflow: 'hidden',
                            '&:focus-within': {
                                borderWidth: error ? '2px' : '0px',
                                borderColor: error ? 'error.main' : 'transparent',
                            },
                            height: '100%',
                            '& .monaco-editor': {
                                outline: 'none !important'
                            }
                        }}
                    >
                        <Editor
                            height={typeof height === 'undefined' ? "100%" : h}
                            language={language}        // 'shell' gives bash highlighting
                            value={field.value ?? ''}
                            onChange={(val) => field.onChange(val ?? '')}
                            theme='vs-dark'
                            onMount={(editor) => {
                                // make it feel like a code editor
                                editor.updateOptions({
                                    fontFamily:
                                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                    fontSize: 13,
                                    lineNumbers: 'on',
                                    minimap: { enabled: false },
                                    wordWrap: 'off',
                                    renderWhitespace: 'selection',
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    automaticLayout: true,
                                    tabSize: 2,
                                    insertSpaces: true,
                                });
                            }}
                            options={{
                                readOnly: disabled,
                                cursorBlinking: "smooth",
                                autoIndent: 'advanced',
                                autoClosingQuotes: "always",
                            }}
                        />
                    </Box>

                    <FormHelperText error={!!error} sx={{ mt: 0.5 }}>
                        {error?.message ?? helperText}
                    </FormHelperText>
                </Box>
            )}
        />
    );
}
