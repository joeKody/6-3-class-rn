import {Divider, NextUIProvider} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {useEffect, useState} from "react";
import schedule from "./schedule";

/*
type Schedule = {
  schedule: {
    day: string;
    period: string[];
  }[];

}
*/

function PeriodElement (props: {
  period: number;
  day: number;
}) {
  if (props.period === -1 || schedule.schedule[props.day]?.period === undefined) {
    return (
      <div className="w-full h-full text-5xl flex items-center justify-center">
        <p>No class</p>
      </div>
    )
  }

  const periodData = schedule.schedule[props.day].period[props.period];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-5xl">{periodData.subject}</div>
      <div>{periodData.teacher}</div>
      <div>{periodData.room}</div>
    </div>
  )
}

export default function App() {
  const day = new Date().getDay();
  const firstPeriod = new Date().setHours(8 - 7, 30, 0, 0);
  const [ time, setTime ] = useState(new Date());
  const [ period, setPeriod ] = useState(0);

  useEffect(() => {
    if (time.getHours() <= 8 - 7) {
      if (time.getMinutes() <= 30) {
        setPeriod(0);
      } else {
        setPeriod(-1);
      }
    } else {
      const currentEpoch = time.getTime() - firstPeriod;
      const periodNum = Math.floor(currentEpoch / (50 * 60 * 1000));
      setPeriod(periodNum + 1);

      if (schedule.schedule[day]?.period && periodNum >= schedule.schedule[day].period.length) {
        setPeriod(-1);
      }
    }

    if (day === 0 || day === 6 || schedule.schedule[day]?.period === undefined) {
      setPeriod(-1);
    }

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [time, day, firstPeriod]);

  return (
    <>
      <NextUIProvider>
        <main className="dark flex flex-row justify-center items-center min-h-screen w-full text-foreground bg-neutral-950">
          <Card className="min-w-[300px] min-h-[200px]">
            <CardHeader>
              <div className="w-full flex flex-col lg:flex-row lg:justify-between items-center">
                <p className="text-xl font-semibold">Current Period</p>
                <p>{time.toLocaleTimeString("th-TH", {timeZone: "Asia/Bangkok"})}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <PeriodElement period={period} day={day} />
            </CardBody>
            <CardFooter>
            </CardFooter>
          </Card>
        </main>
      </NextUIProvider>      
    </>
  )
}