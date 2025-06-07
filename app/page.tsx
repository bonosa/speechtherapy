'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder';

interface Exercise {
  id: string;
  type: 'VOWEL' | 'CONSONANT' | 'WORD' | 'SENTENCE' | 'TONGUE_TWISTER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  content: string;
  instructions: string;
}

const sampleExercises: Exercise[] = [
  {
    id: '1',
    type: 'VOWEL',
    difficulty: 'EASY',
    content: 'ah',
    instructions: 'Say "ah" as in "father"',
  },
  {
    id: '2',
    type: 'CONSONANT',
    difficulty: 'EASY',
    content: 'ba',
    instructions: 'Say "ba" as in "ball"',
  },
  {
    id: '3',
    type: 'WORD',
    difficulty: 'MEDIUM',
    content: 'butterfly',
    instructions: 'Say "butterfly" clearly and slowly',
  },
  {
    id: '4',
    type: 'SENTENCE',
    difficulty: 'HARD',
    content: 'The quick brown fox jumps over the lazy dog',
    instructions: 'Say this sentence clearly and at a moderate pace',
  },
  {
    id: '5',
    type: 'TONGUE_TWISTER',
    difficulty: 'HARD',
    content: 'She sells seashells by the seashore',
    instructions: 'Try to say this tongue twister three times quickly',
  },
];

export default function Home() {
  const [currentExercise, setCurrentExercise] = useState<Exercise>(sampleExercises[0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      setIsAnalyzing(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('exerciseId', currentExercise.id);
      formData.append('expectedText', currentExercise.content);

      const response = await fetch('/api/analyze-speech', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranscription(data.transcription);
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error analyzing speech:', error);
      setFeedback('Error analyzing speech. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextExercise = () => {
    const currentIndex = sampleExercises.indexOf(currentExercise);
    const nextIndex = (currentIndex + 1) % sampleExercises.length;
    setCurrentExercise(sampleExercises[nextIndex]);
    setFeedback(null);
    setTranscription(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Speech Therapy Practice
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ my: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentExercise.content}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {currentExercise.instructions}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
            disabled={isAnalyzing}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button
            variant="outlined"
            onClick={nextExercise}
            disabled={isRecording || isAnalyzing}
          >
            Next Exercise
          </Button>
        </Box>

        {isAnalyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {transcription && (
          <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Speech
              </Typography>
              <Typography variant="body1">{transcription}</Typography>
            </CardContent>
          </Card>
        )}

        {feedback && (
          <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feedback
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {feedback}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
} 