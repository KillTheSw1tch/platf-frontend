import React from 'react';
import '../styles/TabsBar.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TabsBar = ({ tabs, activeTabId, onTabClick, onAddTab, onCloseTab, onReorderTabs }) => {
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newTabs = Array.from(tabs);
    const [movedTab] = newTabs.splice(result.source.index, 1);
    newTabs.splice(result.destination.index, 0, movedTab);

    onReorderTabs(newTabs); // ❗ Функция из родителя
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tabs" direction="horizontal">
        {(provided) => (
          <div
            className="tabs-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tabs.map((tab, index) => (
              <Draggable key={tab.id} draggableId={tab.id.toString()} index={index}>
                {(provided) => (
                  <div
                    className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
                    onClick={() => onTabClick(tab.id)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <span
                      className="tab-title"
                      dangerouslySetInnerHTML={{ __html: tab.title }}
                    />
                    {tab.newCount > 0 && (
                      <span className="tab-counter">{tab.newCount}</span>
                    )}
                    <span
                      className="close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                    >
                      ×
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="add-tab" onClick={onAddTab}>+</div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TabsBar;
