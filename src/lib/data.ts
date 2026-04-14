import { Seat, Location } from './types';

function generateSeats(location: Location): Seat[] {
  const seats: Seat[] = [];
  const tables = location === 'library' ? 8 : 6;
  const seatsPerTable = location === 'library' ? 4 : 6;
  for (let t = 1; t <= tables; t++) {
    for (let s = 1; s <= seatsPerTable; s++) {
      seats.push({
        _id: `${location}-T${t}S${s}`,
        tableNumber: t,
        seatNumber: s,
        label: `T${t}-S${s}`,
      });
    }
  }
  return seats;
}

export const librarySeats = generateSeats('library');
export const labSeats = generateSeats('lab');
