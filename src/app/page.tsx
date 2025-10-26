import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box minH="100vh" bg="bg.secondary">
      <Container maxW="container.xl" py={16}>
        <Heading as="h1" size="2xl" mb={4} color="text.primary">
          Three.js Portfolio
        </Heading>
        <Text fontSize="xl" color="text.secondary">
          Interactive 3D Experiences - Coming Soon
        </Text>
      </Container>
    </Box>
  );
}
