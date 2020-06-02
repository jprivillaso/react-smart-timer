import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2'

import * as S from './styled';
import { calculateNewTime } from './interval';

import CountdownContext, {
  CountdownValueContext,
  CountdownStatusContext,
  Status
} from '../../state/context';
import { isInputValid } from '../../commons/validateUserInput';

function Header() {
  // shared state
  const { countdownValue, setCurrentValue } = useContext(CountdownContext) as CountdownValueContext;
  const { countdownStatus, setCurrentStatus } = useContext(CountdownContext) as CountdownStatusContext;

  // local state
  const [ time, setTime ] = useState('');

  useEffect(() => {
    if (
      !countdownStatus ||
      countdownStatus === Status.Ended ||
      countdownStatus === Status.Paused ||
      countdownStatus === Status.Stopped
    ) return;

    const originalTime = parseInt(time.replace(':', ''));
    const halfTime = originalTime / 2;
    const endTime = 0;

    const interval = setInterval(() => {
      const newTime = calculateNewTime(countdownValue);
      setCurrentValue(newTime);

      // Update countdown visualization style
      const newFormattedTime = parseInt(newTime.replace(':', ''));
      if (newFormattedTime === endTime) {
        // resets everything
        setCurrentStatus(Status.Ended);
        setCurrentValue('');
        setTime('')
      } else if (newFormattedTime <= halfTime) {
        setCurrentStatus(Status.HalfPassed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    setCurrentValue,
    setCurrentStatus,
    countdownValue,
    countdownStatus,
    time
  ]);

  const startCountdown = () => {
    if (isInputValid(time)) {
      setCurrentValue(time);
      setCurrentStatus(Status.Started)
    } else {
      Swal.fire(
        'Error',
        'Please insert the value with the proper format MM:SS',
        'error'
      );
    }
  }

  return (
    <S.Header>
      <S.Vertical>
        <S.Text>Smart Countdown</S.Text>
        <div>
          <S.Input
            placeholder="02:30"
            value={ time || '' }
            onChange={
              (e: React.SyntheticEvent<HTMLInputElement>) => setTime(`${ e.currentTarget.value }`)
            }
          ></S.Input>
          <S.Button
            onClick={() => startCountdown()}
          >Start</S.Button>
        </div>
      </S.Vertical>
    </S.Header>
  );
}

export default Header;