/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { updatePage, imagePath, uploadImage, deleteImages } from '@/app/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronDownIcon, Plus, Trash2 } from 'lucide-react';
import FileInput from '@/components/form/input/FileInput';
import Select from './Select';
import { getPage } from "@/app/utils/api";
import Image from 'next/image';
import { Button } from '../ui/Button';

interface ButtonData {
  text: string;
  link: string;
}

interface SectionItem {
  subtitle: string;
  description: string;
  link?: string;
}

interface Section2 {
  bg_image: string;
  title: string;
  items: SectionItem[];
  primary_button: ButtonData;
  logos: string[];
}

interface Section3Item {
  image: string;
  title: string;
  button: ButtonData;
}

interface Section4 {
  bg_image: string;
  title: string;
  items: SectionItem[];
}

interface Section5 {
  bg_image: string;
  title: string;
  items: SectionItem[];
  primary_button: ButtonData;
}

interface HomePageSections {
  section1: {
    bg_image: string;
    title: string;
    list: string[];
    primary_button: ButtonData;
    secondary_button: ButtonData;
  };
  section2: Section2;
  section3: Section3Item[];
  section4: Section4;
  section5: Section5;
}

interface Page {
  id: string;
  title?: string;
  slug?: string;
  content: string;
  status?: string;
  thumbnail_url?: string;
  meta_title?: string;
  meta_description?: string;
}

const HomePageEditorForm = ({ isOpenModel, setIsOpenModel, pageData, setPageUpdate }: any) => {
  const [formData, setFormData] = useState<Page>({
    id: '',
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    thumbnail_url: '',
    meta_title: '',
    meta_description: ''
  });
  const [sections, setSections] = useState<HomePageSections>({
    section1: {
      bg_image: "",
      title: "",
      list: [""],
      primary_button: { text: "View All Products", link: "/" },
      secondary_button: { text: "Contact Us", link: "/" }
    },
    section2: {
      bg_image: "",
      title: "",
      items: [
        { subtitle: "", description: "" }

      ],
      primary_button: { text: "Read More", link: "/" },
      logos: [""]
    },
    section3: [
      { image: "", title: "", button: { text: "Learn More", link: "/feature-1" } }
      
    ],
    section4: {
      bg_image: "",
      title: "",
      items: [
        { subtitle: "", description: "", link: "/service-1" }  
      ]
    },
    section5: {
      bg_image: "",
      title: "",
      items: [
        { subtitle: "", description: "" }
      ],
      primary_button: { text: "Read More", link: "/" }
    }
  });
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('draft');
  const [activeSection, setActiveSection] = useState('section1');

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!pageData ) return;
    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      const dataPage = await getPage(pageData);

      setStatus(dataPage.status);
      setFormData({
        id: dataPage.id,
        title: dataPage.title,
        slug: dataPage.slug,
        content: dataPage.content,
        status: dataPage.status,
        thumbnail_url: dataPage.thumbnail,
        meta_title: dataPage.meta_title,
        meta_description: dataPage.meta_description,
      });

      if (dataPage.content) {
        try {
          setSections(JSON.parse(dataPage.content));
        } catch (err) {
          console.error("Failed to parse sections", err);
        }
      }
    };

    fetchData();
  }, [pageData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!value && name !== 'slug') {
      setError(`${name} is required`);
    } else if (name === 'slug' && value.length < 3) {
      setError("Slug can not be less than 3 characters");
    } else {
      setError('');
    };

    if (name === 'slug') {
      const slugValue = value.replace(/\s+/g, '-').toLowerCase();
      setFormData((prev) => ({ ...prev, [name]: slugValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSectionChangefile = async (section: string, value: string, field: string, img_data?: File, e?: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (!img_data) return;
    const formData = new FormData();
    formData.append("file", img_data);

    const uploadedImage = await uploadImage(formData);
    console.log("img_data", uploadedImage);

    setSections(prev => {
      const newSections = { ...prev };

      if (section === 'section2' && field === 'logos' && index !== undefined) {
        const sectionData = newSections[section as keyof HomePageSections];
        const logos = [...(sectionData as any).logos];
        logos[index] = uploadedImage.url;
        (newSections.section2 as any).logos = logos;
        return newSections;
      }
      if (section === 'section3' && field === 'image' && index !== undefined) {
        (newSections[section as keyof HomePageSections] as any)[index].image = uploadedImage.url;
        return newSections;
      }

      (newSections[section as keyof HomePageSections] as any)[field] = uploadedImage.url;
      return newSections;
    });
    if (e && e.target) {
      e.target.value = "";
    }
  }
  const handleSectionChange = (section: string, field: string, value: any, index?: number, subField?: string) => {
    setSections(prev => {
      const newSections = { ...prev };

      if (section === 'section3') {
        if (index !== undefined) {
          const newSection3 = [...newSections.section3];
          if (subField) {
            if (field === 'button') {
              newSection3[index] = {
                ...newSection3[index],
                button: {
                  ...newSection3[index].button,
                  [subField]: value
                }
              };
            } else {
              newSection3[index] = {
                ...newSection3[index],
                [field]: value
              };
            }
          } else {
            newSection3[index] = {
              ...newSection3[index],
              [field]: value
            };
          }
          newSections.section3 = newSection3;
        }
      } else {
        const sectionData = newSections[section as keyof HomePageSections];
        if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
          if (field === 'items' && index !== undefined) {
            const items = [...(sectionData as any).items];
            if (subField) {
              items[index] = { ...items[index], [subField]: value };
            } else {
              items[index] = { ...items[index], ...value };
            }
            (newSections[section as keyof HomePageSections] as any).items = items;
          } else if (field.includes('.')) {
            const [parentField, childField] = field.split('.');
            (newSections[section as keyof HomePageSections] as any)[parentField][childField] = value;
          } else if (section === 'section1' && field === 'list' && index !== undefined) {
            const list = [...(sectionData as any).list];
            list[index] = value;
            (newSections.section1 as any).list = list;
          } else if (section === 'section2' && field === 'logos' && index !== undefined) {
            const logos = [...(sectionData as any).logos];
            logos[index] = value;
            (newSections.section2 as any).logos = logos;
          } else {
            (newSections[section as keyof HomePageSections] as any)[field] = value;
          }
        }
      }

      return newSections;
    });
  };

  const addListItem = (section: string) => {
    if (section === 'section1') {
      setSections(prev => ({
        ...prev,
        section1: {
          ...prev.section1,
          list: [...prev.section1.list, '']
        }
      }));
    } else if (section === 'section2') {
      setSections(prev => ({
        ...prev,
        section2: {
          ...prev.section2,
          items: [...prev.section2.items, { subtitle: '', description: '' }]
        }
      }));
    } else if (section === 'section3') {
      setSections(prev => ({
        ...prev,
        section3: [...prev.section3, { image: '', title: '', button: { text: '', link: '' } }]
      }));
    } else if (section === 'section4') {
      setSections(prev => ({
        ...prev,
        section4: {
          ...prev.section4,
          items: [...prev.section4.items, { subtitle: '', description: '', link: '' }]
        }
      }));
    } else if (section === 'section5') {
      setSections(prev => ({
        ...prev,
        section5: {
          ...prev.section5,
          items: [...prev.section5.items, { subtitle: '', description: '' }]
        }
      }));
    }
  };

  const removeListItem = (section: string, index: number) => {
    if (section === 'section1') {
      setSections(prev => ({
        ...prev,
        section1: {
          ...prev.section1,
          list: prev.section1.list.filter((_, i) => i !== index)
        }
      }));
    } else if (section === 'section2') {
      setSections(prev => ({
        ...prev,
        section2: {
          ...prev.section2,
          items: prev.section2.items.filter((_, i) => i !== index)
        }
      }));
    } else if (section === 'section3') {
      setSections(prev => ({
        ...prev,
        section3: prev.section3.filter((_, i) => i !== index)
      }));
    } else if (section === 'section4') {
      setSections(prev => ({
        ...prev,
        section4: {
          ...prev.section4,
          items: prev.section4.items.filter((_, i) => i !== index)
        }
      }));
    } else if (section === 'section5') {
      setSections(prev => ({
        ...prev,
        section5: {
          ...prev.section5,
          items: prev.section5.items.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const addLogo = () => {
    setSections(prev => ({
      ...prev,
      section2: {
        ...prev.section2,
        logos: [...prev.section2.logos, '']
      }
    }));
  };

  const removeLogo = (index: number) => {
    setSections(prev => ({
      ...prev,
      section2: {
        ...prev.section2,
        logos: prev.section2.logos.filter((_, i) => i !== index)
      }
    }));
  };

  const removeSection3image = (index: number) => {
    setSections(prev => {
      const newSection3 = prev.section3.map((item, i) =>
        i === index ? { ...item, image: '' } : item
      );

      return {
        ...prev,
        section3: newSection3,
      };
    });
  };

  const removethumbnail = (thumbnail_url: string) => {
    setRemoveImages(prev => [...prev, thumbnail_url]);
    setFormData((prev) => ({ ...prev, thumbnail_url: '' }));
  };

  function RemoveImage(thumbnail_url: string) {
    setRemoveImages(prev => [...prev, thumbnail_url]);
  }
  const handleClose = () => setIsOpenModel(false);

  const selectOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev!,
      thumbnail: file,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
    setStatus(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData?.title || !formData?.slug) {
      setError('You can not leave the required fields empty');
      return;
    }
    if (error) {
      return;
    }
    try {
      // Convert sections to JSON string for content
      const updatedFormData = {
        ...formData,
        content: JSON.stringify(sections, null, 2)
      };

      const response = await updatePage(pageData, updatedFormData);
      if (response?.status === 200) {

        removeImages.forEach(async (thumbnail_url) => await deleteImages(thumbnail_url));

        toast("Page updated successfully");
        setPageUpdate(true);
        setTimeout(() => {

          handleClose();
        }, 1000);
      }
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        setError(err.response.data.detail || "User not found");
      } else if (err.request) {
        console.error("No response:", err.request);
        setError("No response from server");
      } else {
        console.error("Error:", err.message);
        setError("Unexpected error occurred");
      }
    }
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'section1':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Background Image:
              </label>
              <div className='flex flex-row gap-2 mb-2'>
                <FileInput
                  onChange={(e) => handleSectionChangefile('section1', sections.section1.bg_image, 'bg_image', e.target.files?.[0], e)}
                />
                {sections.section1.bg_image && (
                  <>
                    <Image className='rounded-sm h-40' src={imagePath + sections.section1.bg_image} alt="bg image" width={150} height={100} />
                    <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { handleSectionChange('section1', 'bg_image', ''); RemoveImage(sections.section1.bg_image); }}><Trash2 size={16} /></Button>
                  </>
                )}

              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={sections.section1.title}
                onChange={(e) => handleSectionChange('section1', 'title', e.target.value)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                List Items
              </label>
              {sections.section1.list.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleSectionChange('section1', 'list', e.target.value, index)}
                    className="flex-1 h-11 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('section1', index)}
                    className="h-11 px-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('section1')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                <Plus size={16} /> Add List Item
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={sections.section1.primary_button.text}
                  onChange={(e) => handleSectionChange('section1', 'primary_button.text', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={sections.section1.primary_button.link}
                  onChange={(e) => handleSectionChange('section1', 'primary_button.link', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={sections.section1.secondary_button.text}
                  onChange={(e) => handleSectionChange('section1', 'secondary_button.text', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={sections.section1.secondary_button.link}
                  onChange={(e) => handleSectionChange('section1', 'secondary_button.link', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>
        );

      case 'section2':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Background Image
              </label>
              <div className='flex flex-row gap-2 mb-2'>
                <FileInput
                  onChange={(e) => handleSectionChangefile('section2', sections.section2.bg_image, 'bg_image', e.target.files?.[0], e)}
                />
                {sections.section2.bg_image && (
                  <>
                    <Image className='rounded-sm h-40' src={imagePath + sections.section2.bg_image} alt="bg image" width={150} height={100} />
                    <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { handleSectionChange('section2', 'bg_image', ''); RemoveImage(sections.section2.bg_image); }}><Trash2 size={16} /></Button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={sections.section2.title}
                onChange={(e) => handleSectionChange('section2', 'title', e.target.value)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Items
              </label>
              {sections.section2.items.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Item {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeListItem('section2', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={item.subtitle}
                      onChange={(e) => handleSectionChange('section2', 'items', e.target.value, index, 'subtitle')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleSectionChange('section2', 'items', e.target.value, index, 'description')}
                      rows={3}
                      className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('section2')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={sections.section2.primary_button.text}
                  onChange={(e) => handleSectionChange('section2', 'primary_button.text', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={sections.section2.primary_button.link}
                  onChange={(e) => handleSectionChange('section2', 'primary_button.link', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Logos
              </label>
              {sections.section2.logos.map((logo, index) => (


                <div key={index} className='flex flex-row gap-2 mb-2'>
                  <FileInput
                    onChange={(e) => handleSectionChangefile('section2', sections.section2.logos[index], 'logos', e.target.files?.[0], e, index)}

                  />
                  {sections.section2.logos[index] && (
                    <>
                      <Image className='rounded-sm h-20' src={imagePath + sections.section2.logos[index]} alt="bg image" width={150} height={100} />
                      <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { removeLogo(index); RemoveImage(sections.section2.logos[index]); }}><Trash2 size={16} /></Button>
                    </>
                  )}
                </div>

              ))}
              <button
                type="button"
                onClick={addLogo}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                <Plus size={16} /> Add Logo
              </button>
            </div>
          </div>
        );

      case 'section3':
        return (
          <div className="space-y-4">
            {sections.section3.map((item, index) => (
              <div key={index} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Card {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeListItem('section3', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div key={index} className='flex flex-row gap-2 mb-2'>
                    <FileInput
                      onChange={(e) => handleSectionChangefile('section3', sections.section3[index].image, 'image', e.target.files?.[0], e, index)}
                    />
                    {sections.section3[index].image && (
                      <>
                        <Image className='rounded-sm h-20' src={imagePath + sections.section3[index].image} alt="bg image" width={150} height={100} />
                        <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { removeSection3image(index); RemoveImage(sections.section3[index].image) }}><Trash2 size={16} /></Button>
                      </>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => handleSectionChange('section3', 'title', e.target.value, index)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={item.button.text}
                      onChange={(e) => handleSectionChange('section3', 'button', e.target.value, index, 'text')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <input
                      type="text"
                      placeholder="Button Link"
                      value={item.button.link}
                      onChange={(e) => handleSectionChange('section3', 'button', e.target.value, index, 'link')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('section3')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
            >
              <Plus size={16} /> Add Card
            </button>
          </div>
        );

      case 'section4':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Background Image
              </label>
              <div className='flex flex-row gap-2 mb-2'>
                <FileInput
                  onChange={(e) => handleSectionChangefile('section4', sections.section4.bg_image, 'bg_image', e.target.files?.[0], e)}

                />
                {sections.section4.bg_image && (
                  <>
                    <Image className='rounded-sm h-40' src={imagePath + sections.section4.bg_image} alt="bg image" width={150} height={100} />
                    <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { handleSectionChange('section4', 'bg_image', ''); RemoveImage(sections.section4.bg_image) }}><Trash2 size={16} /></Button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={sections.section4.title}
                onChange={(e) => handleSectionChange('section4', 'title', e.target.value)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Items
              </label>
              {sections.section4.items.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Service {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeListItem('section4', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={item.subtitle}
                      onChange={(e) => handleSectionChange('section4', 'items', e.target.value, index, 'subtitle')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleSectionChange('section4', 'items', e.target.value, index, 'description')}
                      rows={3}
                      className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <input
                      type="text"
                      placeholder="Link"
                      value={item.link || ''}
                      onChange={(e) => handleSectionChange('section4', 'items', e.target.value, index, 'link')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('section4')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                <Plus size={16} /> Add Service
              </button>
            </div>
          </div>
        );

      case 'section5':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Background Image
              </label>
              <div className='flex flex-row gap-2 mb-2'>
                <FileInput
                  onChange={(e) => handleSectionChangefile('section5', sections.section5.bg_image, 'bg_image', e.target.files?.[0], e)}
                />
                {sections.section5.bg_image && (
                  <>
                    <Image className='rounded-sm h-40' src={imagePath + sections.section5.bg_image} alt="bg image" width={150} height={100} />
                    <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => { handleSectionChange('section5', 'bg_image', ''); RemoveImage(sections.section5.bg_image) }}><Trash2 size={16} /></Button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={sections.section5.title}
                onChange={(e) => handleSectionChange('section5', 'title', e.target.value)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Items
              </label>
              {sections.section5.items.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Feature {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeListItem('section5', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={item.subtitle}
                      onChange={(e) => handleSectionChange('section5', 'items', e.target.value, index, 'subtitle')}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleSectionChange('section5', 'items', e.target.value, index, 'description')}
                      rows={2}
                      className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('section5')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={sections.section5.primary_button.text}
                  onChange={(e) => handleSectionChange('section5', 'primary_button.text', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={sections.section5.primary_button.link}
                  onChange={(e) => handleSectionChange('section5', 'primary_button.link', e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpenModel) return null;

  return (
    <div className="fixed inset-0 flex justify-center overflow-y-auto modal z-[99999]">
      <ToastContainer />
      <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
      <div className="relative w-full max-w-7xl m-4 rounded-3xl bg-white dark:bg-gray-900">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-[999] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6 h-[95vh]">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Home Page
            </h4>
          </div>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3 flex gap-6 flex-col lg:flex-row lg:gap-8 lg:px-0 lg:pb-0">
              {/* Left Side - Page Info */}
              <div className="flex-2">
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {['section1', 'section2', 'section3', 'section4', 'section5'].map((section) => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeSection === section
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                      >
                        {section.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4 h-[70vh] overflow-y-auto">
                  {renderSectionContent()}
                </div>


              </div>


              {/* Right Side - Sections */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mt-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData?.meta_title || ""}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      name="meta_description"
                      value={formData?.meta_description || ""}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  </div>
                </div>

                <div className='mt-3'>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Thumbnail Image
                  </label>
                  {formData?.thumbnail_url && (
                    <div className="flex gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <Image
                        src={imagePath + formData?.thumbnail_url || "/placeholder-image.png"}
                        alt="Thumbnail"
                        width={150}
                        height={150}
                        className="mb-2 rounded-lg border object-cover w-40 h-40"
                      />
                      <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => formData?.thumbnail_url && removethumbnail(formData?.thumbnail_url)}><Trash2 size={16} /></Button>
                    </div>
                  )}
                  <FileInput
                    onChange={handleFile}
                  />
                </div>

                <div className='mt-3'>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Status:
                  </label>
                  <div className="relative">
                    <Select
                      options={selectOptions}
                      placeholder="Select status"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                      value={status}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            {error && (<span className="text-error-500 font-semibold">{error}</span>)}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePageEditorForm;