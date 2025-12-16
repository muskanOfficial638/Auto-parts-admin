/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast, ToastContainer } from 'react-toastify';
import { 
  Plus, Edit2, Trash2, X, Save, GripVertical, 
  ChevronRight, Folder, Home, Menu, ChevronDown,
  ChevronUp, ArrowRight, FolderTree, Indent, Outdent,
  CornerDownRight, CornerDownLeft, MoveRight, MoveLeft
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  parentId?: string | null;
  target?: '_blank' | '_self';
  isActive: boolean;
  icon?: string;
  submenu?: MenuItem[];
  level: number;
}

interface MenuGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: MenuItem[];
  isActive: boolean;
  createdAt: Date;
  maxDepth?: number;
}

// Sortable Item Component
const SortableMenuItem = ({ 
  menu, 
  onEdit, 
  onDelete,
  onAddSubmenu,
  depth = 0,
  isDragging = false,
}: {
  menu: MenuItem;
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  onAddSubmenu: (parentId: string) => void;
  depth?: number;
  isDragging?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: menu.id });

  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = menu.submenu && menu.submenu.length > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isItemDragging ? 0.5 : 1,
    marginLeft: `${depth * 32}px`,
  };

  const getIcon = () => {
    if (menu.icon === 'home') return <Home size={16} />;
    if (menu.icon === 'folder') return <Folder size={16} />;
    return <Menu size={16} />;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
          depth > 0 ? 'border-l-4 border-l-brand-300 dark:border-l-brand-700' : ''
        } ${isItemDragging ? 'shadow-lg z-10' : ''} relative group`}
      >
        {/* Drag handle area */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <GripVertical size={20} />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 pl-12">
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                type="button"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
              menu.isActive 
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {getIcon()}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {menu.name}
                </h3>
                {depth > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 rounded flex items-center gap-1">
                    <CornerDownRight size={10} />
                    Level {depth + 1}
                  </span>
                )}
                {menu.target === '_blank' && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded">
                    New Tab
                  </span>
                )}
                {!menu.isActive && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                  {menu.slug}
                </code>
                <span className="text-gray-400">•</span>
                <span>Order: {menu.order}</span>
                {hasChildren && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-brand-500">
                      {menu.submenu!.length} subitem{menu.submenu!.length > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {depth < 2 && (
            <button
              onClick={() => onAddSubmenu(menu.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg dark:text-green-400 dark:hover:bg-green-900/20 transition-colors opacity-0 group-hover:opacity-100"
              type="button"
              title="Add Submenu"
            >
              <Indent size={18} />
            </button>
          )}
          <button
            onClick={() => onEdit(menu)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100"
            type="button"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(menu.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
            type="button"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Render submenu if expanded */}
      {hasChildren && isExpanded && !isDragging && (
        <div className="bg-gray-50/50 dark:bg-gray-850">
          {menu.submenu!.map((child) => (
            <SortableMenuItem
              key={child.id}
              menu={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubmenu={onAddSubmenu}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

// Drop Zone for Indenting/Outdenting
const DropZone = ({ side, onDrop }: { side: 'left' | 'right', onDrop: () => void }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${side}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`absolute top-0 bottom-0 w-8 ${
        side === 'left' ? 'left-0' : 'right-0'
      } flex items-center justify-center z-20`}
      onClick={onDrop}
    >
      <div className={`p-2 rounded-lg transition-all ${
        isOver 
          ? 'bg-brand-500 text-white scale-110' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-0 hover:opacity-100'
      }`}>
        {side === 'left' ? <CornerDownLeft size={16} /> : <CornerDownRight size={16} />}
      </div>
    </div>
  );
};

// Main Menu Manager Component
const MenuManager = () => {
  const defaultMenuGroups: MenuGroup[] = [
    {
      id: '1',
      name: 'Main Navigation',
      slug: 'main',
      description: 'Primary website navigation with submenus',
      isActive: true,
      maxDepth: 3,
      items: [
        { 
          id: '1', 
          name: 'Home', 
          slug: '/', 
          order: 1, 
          parentId: null, 
          target: '_self', 
          isActive: true, 
          icon: 'home',
          submenu: [],
          level: 0
        },
        { 
          id: '2', 
          name: 'About', 
          slug: '/about', 
          order: 2, 
          parentId: null, 
          target: '_self', 
          isActive: true,
          submenu: [
            { 
              id: '2-1', 
              name: 'Our Team', 
              slug: '/about/team', 
              order: 1, 
              parentId: '2', 
              target: '_self', 
              isActive: true,
              submenu: [
                { 
                  id: '2-1-1', 
                  name: 'Leadership', 
                  slug: '/about/team/leadership', 
                  order: 1, 
                  parentId: '2-1', 
                  target: '_self', 
                  isActive: true,
                  submenu: [],
                  level: 2
                }
              ],
              level: 1
            },
            { 
              id: '2-2', 
              name: 'History', 
              slug: '/about/history', 
              order: 2, 
              parentId: '2', 
              target: '_self', 
              isActive: true,
              submenu: [],
              level: 1
            }
          ],
          level: 0
        },
        { 
          id: '3', 
          name: 'Services', 
          slug: '/services', 
          order: 3, 
          parentId: null, 
          target: '_self', 
          isActive: true,
          submenu: [],
          level: 0
        },
        { 
          id: '4', 
          name: 'Contact', 
          slug: '/contact', 
          order: 4, 
          parentId: null, 
          target: '_self', 
          isActive: true,
          submenu: [],
          level: 0
        },
      ],
      createdAt: new Date(),
    },
  ];

  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(defaultMenuGroups);
  const [activeMenuGroup, setActiveMenuGroup] = useState<string>('main');
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [editingMenuGroup, setEditingMenuGroup] = useState<MenuGroup | null>(null);
  const [newMenu, setNewMenu] = useState<Omit<MenuItem, 'id' | 'order' | 'submenu' | 'level'>>({
    name: '',
    slug: '',
    parentId: null,
    target: '_self',
    isActive: true,
    icon: '',
  });
  const [newMenuGroup, setNewMenuGroup] = useState<Omit<MenuGroup, 'id' | 'items' | 'createdAt'>>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    maxDepth: 3,
  });
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isMenuGroupModalOpen, setIsMenuGroupModalOpen] = useState(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
  const [isEditMenuGroupModalOpen, setIsEditMenuGroupModalOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load from localStorage
  useEffect(() => {
    const savedMenuGroups = localStorage.getItem('menuGroups');
    if (savedMenuGroups) {
      try {
        const parsedGroups = JSON.parse(savedMenuGroups);
        setMenuGroups(parsedGroups.map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
        })));
      } catch (error) {
        console.error('Failed to parse saved menus:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('menuGroups', JSON.stringify(menuGroups));
  }, [menuGroups]);

  // Helper functions for nested structure
  const flattenMenuItems = (items: MenuItem[], level = 0): MenuItem[] => {
    const flatItems: MenuItem[] = [];
    
    items.forEach(item => {
      const itemWithLevel = { ...item, level };
      flatItems.push(itemWithLevel);
      
      if (item.submenu && item.submenu.length > 0) {
        flatItems.push(...flattenMenuItems(item.submenu, level + 1));
      }
    });
    
    return flatItems;
  };

  const findMenuItem = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenu && item.submenu.length > 0) {
        const found = findMenuItem(item.submenu, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findMenuItemParent = (items: MenuItem[], id: string, parent: MenuItem | null = null): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return parent;
      if (item.submenu && item.submenu.length > 0) {
        const found = findMenuItemParent(item.submenu, id, item);
        if (found) return found;
      }
    }
    return null;
  };

  const updateMenuItemInTree = (items: MenuItem[], id: string, updates: Partial<MenuItem>): MenuItem[] => {
    return items.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      if (item.submenu && item.submenu.length > 0) {
        return { ...item, submenu: updateMenuItemInTree(item.submenu, id, updates) };
      }
      return item;
    });
  };

  const deleteMenuItemFromTree = (items: MenuItem[], id: string): MenuItem[] => {
    return items.filter(item => {
      if (item.id === id) return false;
      if (item.submenu && item.submenu.length > 0) {
        item.submenu = deleteMenuItemFromTree(item.submenu, id);
      }
      return true;
    });
  };

  const addMenuItemToTree = (items: MenuItem[], newItem: MenuItem, parentId: string | null = null): MenuItem[] => {
    if (parentId === null) {
      return [...items, newItem].sort((a, b) => a.order - b.order);
    }
    
    return items.map(item => {
      if (item.id === parentId) {
        const submenu = [...(item.submenu || []), newItem];
        return { 
          ...item, 
          submenu: submenu.sort((a, b) => a.order - b.order) 
        };
      }
      if (item.submenu && item.submenu.length > 0) {
        return { ...item, submenu: addMenuItemToTree(item.submenu, newItem, parentId) };
      }
      return item;
    });
  };

  const reorderMenuItems = (items: MenuItem[], activeId: string, overId: string): MenuItem[] => {
    const activeItem = findMenuItem(items, activeId);
    const overItem = findMenuItem(items, overId);
    
    if (!activeItem || !overItem) return items;

    const activeParent = findMenuItemParent(items, activeId);
    const overParent = findMenuItemParent(items, overId);

    // If moving within same parent
    if (activeParent?.id === overParent?.id) {
      const parentItems = activeParent ? activeParent.submenu || [] : items;
      const oldIndex = parentItems.findIndex(item => item.id === activeId);
      const newIndex = parentItems.findIndex(item => item.id === overId);
      
      const newParentItems = arrayMove(parentItems, oldIndex, newIndex)
        .map((item, index) => ({ ...item, order: index + 1 }));
      
      if (activeParent) {
        return updateMenuItemInTree(items, activeParent.id, { submenu: newParentItems });
      } else {
        return newParentItems;
      }
    } else {
      // Moving to different parent
      const newItems = deleteMenuItemFromTree(items, activeId);
      
      // Update active item's parentId and level
      const updatedActiveItem = {
        ...activeItem,
        parentId: overParent?.id || null,
        level: overParent ? overParent.level + 1 : 0
      };
      
      return addMenuItemToTree(newItems, updatedActiveItem, overParent?.id || null);
    }
  };

  const indentMenuItem = (items: MenuItem[], itemId: string, targetItem: MenuItem): MenuItem[] => {
    const itemToIndent = findMenuItem(items, itemId);
    const itemParent = findMenuItemParent(items, itemId);
    
    if (!itemToIndent || !targetItem || !itemParent) return items;

    // Check max depth
    const activeGroup = getActiveMenuGroup();
    const maxDepth = activeGroup?.maxDepth || 3;
    if (targetItem.level >= maxDepth - 1) {
      toast.error(`Maximum depth of ${maxDepth} levels reached`);
      return items;
    }

    // Remove from current parent
    let updatedItems = deleteMenuItemFromTree(items, itemId);
    
    // Add to target item's submenu
    const updatedItem = {
      ...itemToIndent,
      parentId: targetItem.id,
      level: targetItem.level + 1,
      order: (targetItem.submenu?.length || 0) + 1
    };
    
    updatedItems = addMenuItemToTree(updatedItems, updatedItem, targetItem.id);
    
    // Reorder remaining items in original parent
    if (itemParent) {
      const parentSubmenu = itemParent.submenu || [];
      updatedItems = updateMenuItemInTree(updatedItems, itemParent.id, {
        submenu: parentSubmenu.map((item, index) => ({ ...item, order: index + 1 }))
      });
    }
    
    return updatedItems;
  };

  const outdentMenuItem = (items: MenuItem[], itemId: string, targetParentId: string | null): MenuItem[] => {
    const itemToOutdent = findMenuItem(items, itemId);
    const itemParent = findMenuItemParent(items, itemId);
    
    if (!itemToOutdent || !itemParent) return items;

    // Find new parent (parent of current parent)
    const newParent = findMenuItemParent(items, itemParent.id);
    
    // Remove from current parent
    let updatedItems = deleteMenuItemFromTree(items, itemId);
    
    // Add to new parent or root
    const updatedItem = {
      ...itemToOutdent,
      parentId: newParent?.id || null,
      level: newParent ? newParent.level + 1 : 0,
      order: newParent 
        ? (newParent.submenu?.length || 0) + 1
        : items.filter(item => !item.parentId).length + 1
    };
    
    updatedItems = addMenuItemToTree(updatedItems, updatedItem, newParent?.id || null);
    
    // Reorder items in original parent
    const parentSubmenu = itemParent.submenu || [];
    updatedItems = updateMenuItemInTree(updatedItems, itemParent.id, {
      submenu: parentSubmenu.map((item, index) => ({ ...item, order: index + 1 }))
    });
    
    return updatedItems;
  };

  const getActiveMenuGroup = () => {
    return menuGroups.find(group => group.slug === activeMenuGroup);
  };

  const getActiveMenuItems = () => {
    const group = getActiveMenuGroup();
    return group ? group.items : [];
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDragActiveId(event.active.id as string);
    setDragDirection(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeItem = findMenuItem(getActiveMenuItems(), active.id as string);
      const overItem = findMenuItem(getActiveMenuItems(), over.id as string);
      
      if (activeItem && overItem) {
        const activeRect = event.active.rect.current.translated;
        const overRect = event.over?.rect;
        
        if (activeRect && overRect) {
          const activeCenterX = activeRect.left + activeRect.width / 2;
          const overCenterX = overRect.left + overRect.width / 2;
          
          // Check if dragging to left or right of target
          if (activeCenterX < overCenterX - overRect.width * 0.25) {
            setDragDirection('left');
          } else if (activeCenterX > overCenterX + overRect.width * 0.25) {
            setDragDirection('right');
          } else {
            setDragDirection(null);
          }
        }
      }
    }
    
    setDragOverId(over?.id as string || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeGroup = getActiveMenuGroup();
    
    if (!over || !activeGroup) {
      setDragActiveId(null);
      setDragOverId(null);
      setDragDirection(null);
      return;
    }

    const activeItem = findMenuItem(activeGroup.items, active.id as string);
    const overItem = findMenuItem(activeGroup.items, over.id as string);
    
    if (!activeItem || !overItem) {
      setDragActiveId(null);
      setDragOverId(null);
      setDragDirection(null);
      return;
    }

    let updatedItems = activeGroup.items;

    if (dragDirection === 'right') {
      // Indent: Make active item a submenu of over item
      updatedItems = indentMenuItem(activeGroup.items, active.id as string, overItem);
      toast.success(`"${activeItem.name}" added to "${overItem.name}" submenu`);
    } else if (dragDirection === 'left') {
      // Outdent: Move active item up one level
      const overParent = findMenuItemParent(activeGroup.items, overItem.id);
      updatedItems = outdentMenuItem(activeGroup.items, active.id as string, overParent?.id || null);
      toast.success(`"${activeItem.name}" moved up one level`);
    } else {
      // Normal reorder
      updatedItems = reorderMenuItems(activeGroup.items, active.id as string, over.id as string);
      toast.success('Menu order updated');
    }

    setMenuGroups(groups => 
      groups.map(group =>
        group.slug === activeMenuGroup
          ? { ...group, items: updatedItems }
          : group
      )
    );

    setDragActiveId(null);
    setDragOverId(null);
    setDragDirection(null);
  };

  const handleCreateMenu = () => {
    const activeGroup = getActiveMenuGroup();
    if (!activeGroup) return;

    if (!newMenu.name.trim() || !newMenu.slug.trim()) {
      toast.error('Name and Slug are required');
      return;
    }

    const maxDepth = activeGroup.maxDepth || 3;
    const parentItem = activeParentId ? findMenuItem(activeGroup.items, activeParentId) : null;
    const currentDepth = parentItem ? (parentItem.level || 0) + 1 : 0;

    if (currentDepth >= maxDepth) {
      toast.error(`Maximum depth of ${maxDepth} levels reached`);
      return;
    }

    const formattedSlug = newMenu.slug.startsWith('/') || newMenu.slug.startsWith('http') 
      ? newMenu.slug 
      : `/${newMenu.slug}`;

    const newMenuItem: MenuItem = {
      ...newMenu,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: 1,
      submenu: [],
      level: currentDepth,
    };

    // Get siblings count for order
    const siblings = parentItem 
      ? parentItem.submenu || []
      : activeGroup.items.filter(item => !item.parentId);
    newMenuItem.order = siblings.length + 1;

    setMenuGroups(groups =>
      groups.map(group =>
        group.slug === activeMenuGroup
          ? { ...group, items: addMenuItemToTree(group.items, newMenuItem, activeParentId) }
          : group
      )
    );

    setNewMenu({
      name: '',
      slug: '',
      parentId: null,
      target: '_self',
      isActive: true,
      icon: '',
    });
    setActiveParentId(null);
    setIsMenuModalOpen(false);
    toast.success('Menu item created successfully');
  };

  const handleUpdateMenu = () => {
    if (!editingMenu) return;

    if (!editingMenu.name.trim() || !editingMenu.slug.trim()) {
      toast.error('Name and Slug are required');
      return;
    }

    const formattedSlug = editingMenu.slug.startsWith('/') || editingMenu.slug.startsWith('http')
      ? editingMenu.slug
      : `/${editingMenu.slug}`;

    const updatedMenu = {
      ...editingMenu,
      slug: formattedSlug,
    };

    setMenuGroups(groups =>
      groups.map(group =>
        group.slug === activeMenuGroup
          ? {
              ...group,
              items: updateMenuItemInTree(group.items, updatedMenu.id, updatedMenu),
            }
          : group
      )
    );

    setEditingMenu(null);
    setIsEditMenuModalOpen(false);
    toast.success('Menu item updated successfully');
  };

  const handleDeleteMenu = (id: string) => {
    const activeGroup = getActiveMenuGroup();
    if (!activeGroup) return;

    const itemToDelete = findMenuItem(activeGroup.items, id);
    if (!itemToDelete) return;

    const hasChildren = itemToDelete.submenu && itemToDelete.submenu.length > 0;
    const message = hasChildren 
      ? `This menu item has ${itemToDelete.submenu!.length} subitem(s). Delete this item and all its children?`
      : 'Are you sure you want to delete this menu item?';

    if (window.confirm(message)) {
      setMenuGroups(groups =>
        groups.map(group =>
          group.slug === activeMenuGroup
            ? {
                ...group,
                items: deleteMenuItemFromTree(group.items, id),
              }
            : group
        )
      );
      toast.success('Menu item deleted successfully');
    }
  };

  const handleCreateMenuGroup = () => {
    if (!newMenuGroup.name.trim() || !newMenuGroup.slug.trim()) {
      toast.error('Menu Group Name and Slug are required');
      return;
    }

    if (menuGroups.some(group => group.slug === newMenuGroup.slug)) {
      toast.error('Menu group with this slug already exists');
      return;
    }

    const newGroup: MenuGroup = {
      ...newMenuGroup,
      id: Date.now().toString(),
      items: [],
      createdAt: new Date(),
    };

    setMenuGroups([...menuGroups, newGroup]);
    setActiveMenuGroup(newGroup.slug);
    setNewMenuGroup({
      name: '',
      slug: '',
      description: '',
      isActive: true,
      maxDepth: 3,
    });
    setIsMenuGroupModalOpen(false);
    toast.success('Menu group created successfully');
  };

  const handleUpdateMenuGroup = () => {
    if (!editingMenuGroup) return;

    if (!editingMenuGroup.name.trim() || !editingMenuGroup.slug.trim()) {
      toast.error('Menu Group Name and Slug are required');
      return;
    }

    setMenuGroups(groups =>
      groups.map(group =>
        group.id === editingMenuGroup.id ? editingMenuGroup : group
      )
    );

    setEditingMenuGroup(null);
    setIsEditMenuGroupModalOpen(false);
    toast.success('Menu group updated successfully');
  };

  const handleDeleteMenuGroup = (id: string) => {
    const groupToDelete = menuGroups.find(g => g.id === id);
    if (!groupToDelete) return;

    if (window.confirm(`Are you sure you want to delete the "${groupToDelete.name}" menu group? This will delete all menu items in this group.`)) {
      const updatedGroups = menuGroups.filter(group => group.id !== id);
      setMenuGroups(updatedGroups);
      
      if (activeMenuGroup === groupToDelete.slug && updatedGroups.length > 0) {
        setActiveMenuGroup(updatedGroups[0].slug);
      }
      
      toast.success('Menu group deleted successfully');
    }
  };

  const handleAddSubmenu = (parentId: string) => {
    const activeGroup = getActiveMenuGroup();
    if (!activeGroup) return;

    const parentItem = findMenuItem(activeGroup.items, parentId);
    if (!parentItem) return;

    const maxDepth = activeGroup.maxDepth || 3;
    const currentDepth = parentItem.level || 0;

    if (currentDepth >= maxDepth - 1) {
      toast.error(`Maximum depth of ${maxDepth} levels reached`);
      return;
    }

    setActiveParentId(parentId);
    setNewMenu({
      name: '',
      slug: '',
      parentId: parentId,
      target: '_self',
      isActive: true,
      icon: '',
    });
    setIsMenuModalOpen(true);
  };

  const getFlatMenuItems = (items: MenuItem[]): MenuItem[] => {
    return flattenMenuItems(items);
  };

  const convertToJSONStructure = (items: MenuItem[]): any[] => {
    return items.sort((a, b) => a.order - b.order).map(item => {
      const jsonItem: any = {
        name: item.name,
        slug: item.slug,
        order: item.order,
      };

      if (item.submenu && item.submenu.length > 0) {
        jsonItem.submenu = convertToJSONStructure(item.submenu);
      }

      return jsonItem;
    });
  };

  const openEditMenuModal = (menu: MenuItem) => {
    setEditingMenu({ ...menu });
    setIsEditMenuModalOpen(true);
  };

  const openEditMenuGroupModal = (group: MenuGroup) => {
    setEditingMenuGroup({ ...group });
    setIsEditMenuGroupModalOpen(true);
  };

  const activeGroup = getActiveMenuGroup();
  const activeItems = getActiveMenuItems();
  const flatItems = getFlatMenuItems(activeItems);
  const dragActiveItem = dragActiveId ? findMenuItem(activeItems, dragActiveId) : null;
  const jsonStructure = convertToJSONStructure(activeItems);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderTree className="text-brand-500" size={24} />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Menu Manager
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Drag items left/right to create or remove from submenus
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsMenuGroupModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              type="button"
            >
              <Folder size={18} />
              New Menu Group
            </button>
            <button
              onClick={() => {
                setActiveParentId(null);
                setNewMenu({
                  name: '',
                  slug: '',
                  parentId: null,
                  target: '_self',
                  isActive: true,
                  icon: '',
                });
                setIsMenuModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm"
              type="button"
            >
              <Plus size={18} />
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Drag Instructions */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <GripVertical className="text-gray-500" size={16} />
              <span>Drag to reorder</span>
            </div>
            <div className="flex items-center gap-2">
              <MoveRight className="text-green-500" size={16} />
              <span>Drag right to make submenu</span>
            </div>
            <div className="flex items-center gap-2">
              <MoveLeft className="text-red-500" size={16} />
              <span>Drag left to remove from submenu</span>
            </div>
            <div className="flex items-center gap-2">
              <Indent className="text-brand-500" size={16} />
              <span>Click to add submenu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Menu Groups */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
            <div className="p-4 md:p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Menu Groups
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {menuGroups.length} menu groups
              </p>
            </div>

            <div className="p-2">
              {menuGroups.map((group) => {
                const flatItemsCount = flattenMenuItems(group.items).length;
                return (
                  <div
                    key={group.id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                      activeMenuGroup === group.slug
                        ? 'bg-brand-500 text-white'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setActiveMenuGroup(group.slug)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${
                          activeMenuGroup === group.slug
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Folder size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-xs opacity-75">
                            {flatItemsCount} items • Max depth: {group.maxDepth || 3}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditMenuGroupModal(group);
                          }}
                          className="p-1 hover:bg-white/20 rounded"
                          title="Edit Group"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMenuGroup(group.id);
                          }}
                          className="p-1 hover:bg-white/20 rounded text-red-300"
                          title="Delete Group"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ChevronRight size={18} />
                      </div>
                    </div>
                    {group.description && (
                      <p className="text-xs mt-2 opacity-75 truncate">
                        {group.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Items</span>
                <span className="font-medium">{flattenMenuItems(activeItems).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Submenus</span>
                <span className="font-medium">
                  {flattenMenuItems(activeItems).filter(item => item.level > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nesting Level</span>
                <span className="font-medium">
                  Max {Math.max(...flattenMenuItems(activeItems).map(item => item.level), 0) + 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel - Menu Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
            <div className="p-4 md:p-6 border-b dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {activeGroup?.name || 'Select a Menu Group'}
                    </h2>
                    {activeGroup?.maxDepth && (
                      <span className="px-2 py-1 text-xs bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 rounded">
                        Max {activeGroup.maxDepth} levels
                      </span>
                    )}
                  </div>
                  {activeGroup?.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {activeGroup.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {flattenMenuItems(activeItems).length} total items
                  </span>
                </div>
              </div>
            </div>

            {activeGroup ? (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={flatItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="relative">
                      {activeItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                          <Menu className="mx-auto mb-3" size={32} />
                          <p className="mb-2">No menu items in this group yet</p>
                          <button
                            onClick={() => {
                              setActiveParentId(null);
                              setIsMenuModalOpen(true);
                            }}
                            className="text-brand-500 hover:text-brand-600"
                          >
                            Add your first menu item
                          </button>
                        </div>
                      ) : (
                        activeItems.map((menu) => (
                          <SortableMenuItem
                            key={menu.id}
                            menu={menu}
                            onEdit={openEditMenuModal}
                            onDelete={handleDeleteMenu}
                            onAddSubmenu={handleAddSubmenu}
                            isDragging={!!dragActiveId}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                  
                  <DragOverlay>
                    {dragActiveItem && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border-2 border-brand-500">
                        <div className="flex items-center gap-3">
                          <GripVertical size={20} className="text-brand-500" />
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                            {dragActiveItem.icon === 'home' ? <Home size={16} /> : 
                             dragActiveItem.icon === 'folder' ? <Folder size={16} /> : 
                             <Menu size={16} />}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {dragActiveItem.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {dragActiveItem.slug}
                              </span>
                              {dragDirection && (
                                <span className={`px-2 py-0.5 text-xs rounded ${
                                  dragDirection === 'right' 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {dragDirection === 'right' ? 'Make Submenu' : 'Remove from Submenu'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>

                <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Drag items left/right to manage submenus • Click icons to edit
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Folder className="mx-auto mb-3" size={48} />
                <h3 className="text-lg font-medium mb-2">Select a Menu Group</h3>
                <p>Choose a menu group from the sidebar or create a new one</p>
              </div>
            )}
          </div>

          {/* JSON Preview with exact structure */}
          {activeGroup && (
            <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
              <div className="p-4 md:p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      JSON Structure Preview
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Exact structure for your frontend
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(jsonStructure, null, 2));
                      toast.success('Copied to clipboard');
                    }}
                    className="px-3 py-1.5 bg-brand-500 text-white text-sm rounded hover:bg-brand-600"
                    type="button"
                  >
                    Copy JSON
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs md:text-sm max-h-64 overflow-y-auto">
                    {JSON.stringify(jsonStructure, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Create Menu Modal */}
      {isMenuModalOpen && (
        <Modal
          title={activeParentId ? "Create Submenu Item" : "Create New Menu Item"}
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          onSubmit={handleCreateMenu}
          submitText={activeParentId ? "Create Submenu" : "Create Menu Item"}
        >
          <MenuForm
            menu={newMenu}
            onChange={setNewMenu}
            menuGroups={menuGroups}
            activeGroupSlug={activeMenuGroup}
            parentId={activeParentId}
          />
        </Modal>
      )}

      {/* Edit Menu Modal */}
      {isEditMenuModalOpen && editingMenu && (
        <Modal
          title={`Edit ${editingMenu.level > 0 ? 'Submenu' : 'Menu'} Item`}
          isOpen={isEditMenuModalOpen}
          onClose={() => setIsEditMenuModalOpen(false)}
          onSubmit={handleUpdateMenu}
          submitText="Update Menu Item"
        >
          <MenuForm
            menu={editingMenu}
            onChange={setEditingMenu}
            menuGroups={menuGroups}
            activeGroupSlug={activeMenuGroup}
            parentId={editingMenu.parentId}
            isEdit
          />
        </Modal>
      )}

      {/* Create Menu Group Modal */}
      {isMenuGroupModalOpen && (
        <Modal
          title="Create New Menu Group"
          isOpen={isMenuGroupModalOpen}
          onClose={() => setIsMenuGroupModalOpen(false)}
          onSubmit={handleCreateMenuGroup}
          submitText="Create Menu Group"
        >
          <MenuGroupForm
            menuGroup={newMenuGroup}
            onChange={setNewMenuGroup}
          />
        </Modal>
      )}

      {/* Edit Menu Group Modal */}
      {isEditMenuGroupModalOpen && editingMenuGroup && (
        <Modal
          title="Edit Menu Group"
          isOpen={isEditMenuGroupModalOpen}
          onClose={() => setIsEditMenuGroupModalOpen(false)}
          onSubmit={handleUpdateMenuGroup}
          submitText="Update Menu Group"
        >
          <MenuGroupForm
            menuGroup={editingMenuGroup}
            onChange={setEditingMenuGroup}
            isEdit
          />
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ 
  title, 
  isOpen, 
  onClose, 
  onSubmit, 
  submitText, 
  children 
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitText: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {children}
        </div>

        <div className="p-4 md:p-6 border-t dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            type="button"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Form Component
const MenuForm = ({ 
  menu, 
  onChange, 
  menuGroups,
  activeGroupSlug,
  parentId = null,
  isEdit = false 
}: {
  menu: any;
  onChange: (menu: any) => void;
  menuGroups: MenuGroup[];
  activeGroupSlug: string;
  parentId?: string | null;
  isEdit?: boolean;
}) => {
  const activeGroup = menuGroups.find(g => g.slug === activeGroupSlug);
  const maxDepth = activeGroup?.maxDepth || 3;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          value={menu.name}
          onChange={(e) => onChange({ ...menu, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="e.g., Home, About, Contact"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Slug/URL *
        </label>
        <input
          type="text"
          value={menu.slug}
          onChange={(e) => onChange({ ...menu, slug: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="/about or https://example.com"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Use <code>/path</code> for internal links or <code>https://</code> for external links
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target
          </label>
          <select
            value={menu.target || '_self'}
            onChange={(e) => onChange({ ...menu, target: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
          <select
            value={menu.icon || ''}
            onChange={(e) => onChange({ ...menu, icon: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">No Icon</option>
            <option value="home">Home</option>
            <option value="folder">Folder</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={menu.isActive}
            onChange={(e) => onChange({ ...menu, isActive: e.target.checked })}
            className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>
      </div>

      {isEdit && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {menu.submenu && menu.submenu.length > 0 ? (
              <div>
                Has <span className="font-medium">{menu.submenu.length}</span> subitem{menu.submenu.length > 1 ? 's' : ''}
              </div>
            ) : (
              <div>No subitems</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Menu Group Form Component
const MenuGroupForm = ({ 
  menuGroup, 
  onChange, 
  isEdit = false 
}: {
  menuGroup: any;
  onChange: (group: any) => void;
  isEdit?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Menu Group Name *
        </label>
        <input
          type="text"
          value={menuGroup.name}
          onChange={(e) => onChange({ ...menuGroup, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="e.g., Header Menu, Footer Links"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Slug/Identifier *
        </label>
        <input
          type="text"
          value={menuGroup.slug}
          onChange={(e) => onChange({ ...menuGroup, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="main, header, footer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Maximum Submenu Depth
        </label>
        <select
          value={menuGroup.maxDepth || 3}
          onChange={(e) => onChange({ ...menuGroup, maxDepth: parseInt(e.target.value) })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value="1">1 Level (No Submenus)</option>
          <option value="2">2 Levels</option>
          <option value="3">3 Levels</option>
          <option value="4">4 Levels</option>
          <option value="5">5 Levels</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="groupIsActive"
          checked={menuGroup.isActive}
          onChange={(e) => onChange({ ...menuGroup, isActive: e.target.checked })}
          className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="groupIsActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Active (show this menu on the website)
        </label>
      </div>
    </div>
  );
};

export default MenuManager;