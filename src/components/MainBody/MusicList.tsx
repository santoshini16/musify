import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { songs as initialSongs } from "../../utils/constants";

const MusicList = () => {
  const { playSong, currentSong } = useAudioPlayer();
  const [songs, setSongs] = useState(initialSongs);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(songs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSongs(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="pt-6">
        <div className="flex items-center justify-between w-full px-[3.5rem]">
          <h2 className="mb-4 text-2xl font-semibold text-[#F6F6F6]">Popular</h2>
          <p className="text-main text-lg font-semibold leading-[27px] cursor-pointer">
            See All
          </p>
        </div>
        <div>
          <Droppable droppableId="songs">
            {(provided) => (
              <table
                className="w-full text-left"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead>
                  <tr className="text-lg font-semibold text-main">
                    <th className="py-2 px-14">#</th>
                    <th className="py-2">Title</th>
                    <th className="py-2">Playing</th>
                    <th className="py-2">Time</th>
                    <th className="py-2 text-right px-14">Album</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => playSong(song)}
                          className={`${
                            currentSong.id === song.id
                              ? `bg-[#520000] border-l-borderRed transition-colors duration-200`
                              : ""
                          } relative text-main font-medium hover:bg-[#2C0000] border-l-4 border-transparent text-base cursor-pointer`}
                        >
                          <td className="py-2 px-14">{index + 1}</td>
                          <td className="relative flex items-center gap-2 py-2">
                            <img
                              src={song.artistImage}
                              alt="artist thumbnail"
                              className="absolute size-7 -left-9"
                            />
                            {song.title}
                          </td>
                          <td className="py-2 ">{song.playCount}</td>
                          <td className="py-2 ">{song.timeStamp}</td>
                          <td className="py-2 text-center">{song.album}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default MusicList;


