import { Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { ChallengeInfo } from "../../types";

export interface MainMenuProps {
  challenges: ChallengeInfo[]
  onCreateChallenge: () => void
  onFindChallenge: () => void
}

export default function MainMenu({
  challenges,
  onCreateChallenge,
  onFindChallenge,
}: MainMenuProps) {
  return (
    <>
    <div>
      <Button variant="contained" size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
    <Stack>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        <ListItemButton onClick={onCreateChallenge}>
          <ListItemText primary="Create New Challenge" />
        </ListItemButton>
        <Divider />

        { challenges.length > 0 &&
          <>
            <ListItemButton onClick={onFindChallenge}>
              <ListItemText primary="Find Challenge" />
            </ListItemButton>
          </>
        }
        
      </List>  
    </Stack>
    </>
  )
}