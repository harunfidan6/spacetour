"use client";

import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday,
  parseISO,
  isAfter,
  startOfToday
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Info } from 'lucide-react';
import { events, EventType, eventTypeColors, eventTypeLabels, AstronomicalEvent } from '@/data/events';
import { CosmicEventSimulator } from '@/components/space/CosmicEventSimulator';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(Object.keys(eventTypeLabels) as EventType[]));
  
  const toggleFilter = (type: EventType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => activeFilters.has(e.type));
  }, [activeFilters]);

  const upcomingEvents = useMemo(() => {
    const today = startOfToday();
    return filteredEvents
      .filter(e => isAfter(parseISO(e.date), today) || isSameDay(parseISO(e.date), today))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .slice(0, 8);
  }, [filteredEvents]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="text-primary" />
          {format(currentMonth, 'MMMM yyyy', { locale: tr })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full bg-card-bg border border-gray-800 hover:bg-gray-800 transition text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full bg-card-bg border border-gray-800 hover:bg-gray-800 transition text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-text-secondary py-2 text-sm">
          {format(addDays(startDate, i), 'EEEEEE', { locale: tr })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Find events for this day
        const dayEvents = filteredEvents.filter(e => isSameDay(parseISO(e.date), cloneDay));
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            onClick={() => {
              if (dayEvents.length > 0) {
                setSelectedDate(cloneDay);
              } else {
                setSelectedDate(null);
              }
            }}
            className={`
              relative flex flex-col h-24 border border-gray-800/50 p-1 md:p-2 transition-all cursor-pointer
              ${!isCurrentMonth ? 'text-gray-600 bg-black/20' : 'text-gray-300 bg-card-bg hover:bg-gray-800/60'}
              ${isTodayDate ? 'border-primary/50 bg-primary/5' : ''}
              ${isSelected ? 'ring-2 ring-primary ring-inset bg-gray-800' : ''}
              ${dayEvents.length > 0 ? 'hover:border-gray-500' : ''}
            `}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${isTodayDate ? 'text-primary' : ''}`}>
                {formattedDate}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs bg-gray-800 px-1.5 rounded-md text-gray-400">
                  {dayEvents.length}
                </span>
              )}
            </div>
            
            <div className="mt-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div 
                  key={idx} 
                  className={`text-[10px] md:text-xs truncate px-1 rounded-sm ${eventTypeColors[event.type]}`}
                  title={event.title}
                >
                  {event.emoji} {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-text-secondary px-1">
                  +{dayEvents.length - 3} daha
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-t border-l border-gray-800/50 flex flex-col">{rows}</div>;
  };

  const selectedDayEvents = selectedDate 
    ? filteredEvents.filter(e => isSameDay(parseISO(e.date), selectedDate))
    : [];

  return (
    <div className="min-h-screen bg-background/60 backdrop-blur-sm pb-20 pt-8 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Gök Olayları Takvimi</h1>
            <p className="text-text-secondary max-w-2xl">
              Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları ve daha fazlası. Gelecekteki astronomik olayları keşfedin ve gözlem planınızı yapın.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypeLabels).map(([type, label]) => {
            const t = type as EventType;
            const isActive = activeFilters.has(t);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(t)}
                className={`
                  px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors border
                  ${isActive 
                    ? 'bg-gray-800 text-white border-gray-600' 
                    : 'bg-transparent text-text-secondary border-gray-800 hover:border-gray-600'}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#12122a] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Live Cosmic Simulation Widget */}
            <CosmicEventSimulator
              type={selectedDayEvents[0]?.type || upcomingEvents[0]?.type || 'meteor-yagmuru'}
              title={selectedDayEvents[0]?.title || upcomingEvents[0]?.title || 'Gök Olayı Simülasyonu'}
            />
            {selectedDate && (
              <div className="bg-[#12122a] p-5 rounded-2xl border border-gray-800 shadow-lg animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                  <h3 className="text-xl font-bold text-white">
                    {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
                  </h3>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-text-secondary hover:text-white"
                  >
                    Kapat
                  </button>
                </div>
                
                {selectedDayEvents.length === 0 ? (
                  <p className="text-text-secondary text-sm">Bu tarihte filtrelenmiş gök olayı bulunmamaktadır.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedDayEvents.map(event => (
                      <div key={event.id} className="bg-black/30 p-4 rounded-xl border border-gray-800/80">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            <span>{event.emoji}</span> {event.title}
                          </h4>
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-3 ${eventTypeColors[event.type]}`}>
                          {eventTypeLabels[event.type]}
                        </span>
                        
                        <p className="text-sm text-gray-300 mb-3">{event.description}</p>
                        
                        <div className="bg-[#12122a] p-3 rounded-lg border border-gray-800 text-xs text-gray-400 space-y-2">
                          <div className="flex items-start gap-2">
                            <Info size={14} className="mt-0.5 text-primary shrink-0" />
                            <p>{event.details}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <MapPin size={14} className="text-accent" />
                            <span className="capitalize">{event.visibility.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-[#12122a] p-5 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-secondary" />
                Yaklaşan Olaylar
              </h3>
              
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="flex gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition cursor-pointer border border-transparent hover:border-gray-700"
                    onClick={() => {
                      setCurrentMonth(parseISO(event.date));
                      setSelectedDate(parseISO(event.date));
                    }}
                  >
                    <div className="text-2xl mt-1">{event.emoji}</div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-primary font-medium my-0.5">
                        {format(parseISO(event.date), 'd MMMM yyyy', { locale: tr })}
                      </p>
                      <p className="text-xs text-text-secondary line-clamp-1">{event.description}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-text-secondary">Yakın zamanda filtrelenmiş olay bulunmuyor.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
