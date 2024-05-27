import { Chip, Divider, NextUIProvider } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "@nextui-org/card";
import { useEffect, useState } from "react";
import schedule from "./schedule";

/*
type Schedule = {
  schedule: {
    day: string;
    period: string[];
  }[];

}
*/

function EpochToDate(epoch: number) {
  return new Date(epoch).toTimeString();
}

function PeriodElement(props: { period: number; day: number }) {
  if (
    props.period === -1 ||
    schedule.schedule[props.day]?.period === undefined
  ) {
    return (
      <div className="w-full h-full grow pb-4 text-5xl flex items-center justify-center">
        <p>No class</p>
      </div>
    );
  }

  const periodData = schedule.schedule[props.day].period[props.period];
  const isHomeroom = periodData.room === "321";
  return (
    <>
      <div className="w-full h-full text-5xl grow text-center mb-4 flex justify-center align-center">
        <div>{periodData.subject}</div>
      </div>
      <div className="w-full h-full flex flex-row grow gap-4 text-center justify-center">
        <Chip>{periodData.teacher}</Chip>
        <Chip variant={isHomeroom ? "solid" : "shadow"} color={isHomeroom ? "default" : "primary"}>{periodData.room}</Chip>
      </div>
    </>
  );
}

function Next (props:{
  period: number,
  day: number,
}){
  return (
    <p>
      Next: {schedule.schedule[props.day].period[props.period].subject}
    </p>
  )
}

export default function App() {
  const day = new Date().getDay();
  const firstPeriod = new Date().setHours(8 - 7, 30, 0, 0);
  const [time, setTime] = useState(new Date());
  const [period, setPeriod] = useState(0);
  const [ remaining, setRemaining ] = useState(0);

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

      if (
        schedule.schedule[day]?.period &&
        periodNum >= schedule.schedule[day].period.length
      ) {
        setPeriod(-1);
      }
    }

    if (
      day === 0 ||
      day === 6 ||
      schedule.schedule[day]?.period === undefined
    ) {
      setPeriod(-1);
    }
    setRemaining(firstPeriod + 50 * 60 * 1000 * (period + 0) - time.valueOf());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [time, day, firstPeriod, remaining, period]);

  return (
    <>
      <NextUIProvider>
        <main className="dark flex flex-row justify-center items-center min-h-screen w-full text-foreground bg-neutral-950">
          <Card className="min-w-[310px] min-h-[220px]">
            <CardHeader>
              <div className="w-full flex flex-col lg:flex-row lg:justify-between items-center">
                <p className="text-xl ">Current: <span className="font-bold">{period > 0 ? period : "None"}</span></p>
                <p className="collapse lg:visible">
                  {time.toLocaleTimeString("th-TH", {
                    timeZone: "Asia/Bangkok",
                  })}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="py-4">
              <PeriodElement period={period} day={day} />
            </CardBody>
            <Divider />
            { period > 0 && period < schedule.schedule[day]?.period.length &&
              (
              <CardFooter>
                <div className="w-full flex flex-col lg:flex-row lg:justify-between items-center">
                  <Next period={period} day={day} />
                  <p><Chip variant="shadow" color="secondary">{EpochToDate(remaining).slice(0, 8)}</Chip> remaining</p>
                </div>
              </CardFooter>
              )
            }
          </Card>
        </main>
      </NextUIProvider>
    </>
  );
}
