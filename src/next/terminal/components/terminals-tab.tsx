import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import type { Terminal } from "../type";
import { Card, Collapse, Fade, IconButton, Stack, Typography } from '@mui/material';
import { AddIcon, ExitIcon, FleshDownIcon, FleshUpIcon } from '@next/components/icons';
import TerminalXterm from './terminal';

export default function
    TerminalTabs({
        terminals,
        create,
        over,
        close }: {
            terminals: Terminal[],
            create: (name: string, initialCommand?: string | undefined) => any,
            close: (id: string) => any
            over: {
                tab: number;
                count: number;
            }
        }) {
    const [value, setValue] = React.useState('1');
    const [show, setShow] = React.useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        setShow(true);
    };

    React.useEffect(() => {

        if (terminals.length === 0) return;

        setShow(true);

        setValue(terminals.length.toString())

    }, [terminals.length]);

    React.useEffect(() => {
        if (over.count < 0) return;
        setShow(true);
        setValue(over.tab.toString())
    }, [over.count])

    return (
        <Box
            component={Card}
            className='glassy'
            sx={{
                width: '100%',
                typography: 'body1',
                maxHeight: 700,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                    {
                        !!terminals.length && <IconButton onClick={() => setShow(last => !last)} contextMenu=''>
                            {
                                show ? <FleshDownIcon /> : <FleshUpIcon />
                            }
                        </IconButton>
                    }
                    <TabList
                        onChange={handleChange}
                        aria-label="terminals tabs"
                        variant="scrollable"
                        scrollButtons="auto">
                        {
                            terminals.map((x, i) => <Tab label={<Stack direction="row" alignItems="center" gap={2}>
                                <Typography variant='caption'>
                                    {x.name}
                                </Typography>
                                <Box sx={{ cursor: 'pointer' }} component="span" onClick={() => close(x.id)}>
                                    <ExitIcon width={16} height={16} />
                                </Box>
                            </Stack>} key={i} value={(i + 1).toString()} />)
                        }
                    </TabList>
                    <IconButton onClick={() => create("bash")}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Collapse in={show && !!terminals.length}>
                    <Box sx={{
                        position: 'relative',
                        height: '100%',
                        minHeight: 700
                    }}>
                        {
                            terminals.map((x, i) => <Fade in={(i + 1).toString() === value} key={x.id}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                }}>
                                    <TerminalXterm terminal={x} close={close} />
                                </Box>
                            </Fade>)
                        }
                    </Box>
                </Collapse>
            </TabContext>
        </Box>
    );

}