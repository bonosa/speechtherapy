import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

interface Exercise {
  word: string;
  type: 'vowel' | 'consonant';
  difficulty: 'easy' | 'medium' | 'hard';
}

const exercises: Exercise[] = [
  { word: 'ah', type: 'vowel', difficulty: 'easy' },
  { word: 'ee', type: 'vowel', difficulty: 'easy' },
  { word: 'oh', type: 'vowel', difficulty: 'easy' },
  { word: 'ba', type: 'consonant', difficulty: 'easy' },
  { word: 'ma', type: 'consonant', difficulty: 'easy' },
  { word: 'pa', type: 'consonant', difficulty: 'easy' },
];

function App() {
  const [currentExercise, setCurrentExercise] = useState<Exercise>(exercises[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // Here we would implement actual recording logic
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Here we would implement stop recording logic
  };

  const nextExercise = () => {
    const currentIndex = exercises.indexOf(currentExercise);
    const nextIndex = (currentIndex + 1) % exercises.length;
    setCurrentExercise(exercises[nextIndex]);
    setProgress((nextIndex / exercises.length) * 100);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Speech Therapy Practice
        </Typography>
        
        <Card sx={{ my: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentExercise.word}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Type: {currentExercise.type} | Difficulty: {currentExercise.difficulty}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            color={isRecording ? 'error' : 'primary'}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            sx={{ mr: 2 }}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button
            variant="outlined"
            onClick={nextExercise}
            disabled={isRecording}
          >
            Next Exercise
          </Button>
        </Box>

        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <CircularProgress variant="determinate" value={progress} />
        </Box>
      </Box>
    </Container>
  );
}

export default App; 