'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface ExerciseProgress {
  id: string;
  exerciseId: string;
  score: number;
  feedback: string;
  completedAt: string;
  exercise: {
    type: string;
    content: string;
    difficulty: string;
  };
}

export default function Dashboard() {
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);
  const [stats, setStats] = useState({
    totalExercises: 0,
    averageScore: 0,
    completedToday: 0,
    byType: {
      VOWEL: 0,
      CONSONANT: 0,
      WORD: 0,
      SENTENCE: 0,
      TONGUE_TWISTER: 0,
    },
  });
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockProgress: ExerciseProgress[] = [
      {
        id: '1',
        exerciseId: '1',
        score: 85,
        feedback: 'Good pronunciation of "ah" sound',
        completedAt: new Date().toISOString(),
        exercise: {
          type: 'VOWEL',
          content: 'ah',
          difficulty: 'EASY',
        },
      },
      {
        id: '2',
        exerciseId: '2',
        score: 75,
        feedback: 'Work on the "b" sound clarity',
        completedAt: new Date().toISOString(),
        exercise: {
          type: 'CONSONANT',
          content: 'ba',
          difficulty: 'EASY',
        },
      },
    ];

    setProgress(mockProgress);
    calculateStats(mockProgress);
  }, []);

  const calculateStats = (progressData: ExerciseProgress[]) => {
    const today = new Date().toISOString().split('T')[0];
    const byType = {
      VOWEL: 0,
      CONSONANT: 0,
      WORD: 0,
      SENTENCE: 0,
      TONGUE_TWISTER: 0,
    };

    progressData.forEach((item) => {
      byType[item.exercise.type as keyof typeof byType]++;
    });

    setStats({
      totalExercises: progressData.length,
      averageScore: progressData.reduce((acc, curr) => acc + curr.score, 0) / progressData.length,
      completedToday: progressData.filter(
        (item) => item.completedAt.split('T')[0] === today
      ).length,
      byType,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Progress Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Progress
                </Typography>
                <Typography variant="h3">{stats.completedToday}</Typography>
                <Typography color="text.secondary">exercises completed</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h3">
                  {stats.averageScore.toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.averageScore}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Exercises
                </Typography>
                <Typography variant="h3">{stats.totalExercises}</Typography>
                <Typography color="text.secondary">completed so far</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Exercise Type Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Exercise Types
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <Box key={type} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {type}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.totalExercises) * 100}
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {count} exercises
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {progress.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={item.exercise.content}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {new Date(item.completedAt).toLocaleDateString()}
                            </Typography>
                            {' — '}
                            {item.feedback}
                          </>
                        }
                      />
                      <Chip
                        label={`${item.score}%`}
                        color={item.score >= 80 ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="button"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Start New Exercise
          </Typography>
        </Box>
      </Box>
    </Container>
  );
} 