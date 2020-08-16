import React from 'react';
import * from './Final.css';

const Final = (props) => {
    const dispatch = useDispatch()
    let history = useHistory();

    const exitPage = () => {
        socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
        dispatch({type: 'RESET_USER'})
        history.push('/')
    }

    window.onbeforeunload = function() {

        socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
      dispatch({type: 'RESET_USER'})
      history.push('/')
    }
    window.onpopstate = function() {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
      dispatch({type: 'RESET_USER'})
      history.push('/')
    }

    return(
        <Grid 
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '90vh' }}>
          <Typography id="room">RoomID: {roomID}</Typography>
          <Zoom in={slide} out={slide}>
            <Card id="card-waiting">
            <Grid container alignItems="center" direction="column">
              <CardContent >
                  <Typography id="question">The Winner is... </Typography>
                    <List id="scroll" style={{overflow: 'auto', height: 300}}>
                      {player.map((item, i) => (
                          <ListItem key={i}>
                          <Typography 
                            style={{display: 'flex', margin: 5, fontSize: 25, 
                                  padding: 3, justifyContent: 'left', fontFamily: 'Segoe Print'}}>
                            {renderSentence(item, points[i])}
                          </Typography>
                        </ListItem>
                        ))}
                    </List>
              </CardContent>
              {exit ? <Button id="bottom-buttons" type="secondary" 
                                             onClick={movePage}>Exit</Button> : 
                              <Button id="bottom-buttons" type="secondary" 
                                             onClick={movePage}>Next question</Button>}
              </Grid>
            </Card>
            </Zoom>
        </Grid>
      )

}



export default Final