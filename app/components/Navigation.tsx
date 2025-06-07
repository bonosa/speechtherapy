'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MicIcon from '@mui/icons-material/Mic';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Speech Therapy Practice
        </Typography>
        <Box>
          <Button
            color={pathname === '/dashboard' ? 'primary' : 'inherit'}
            startIcon={<DashboardIcon />}
            onClick={() => router.push('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            color={pathname === '/' ? 'primary' : 'inherit'}
            startIcon={<MicIcon />}
            onClick={() => router.push('/')}
          >
            Practice
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 