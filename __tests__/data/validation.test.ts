import servicesData from '../../public/data/services.json'
import tagsData from '../../public/data/tags.json'
import { Service, TagData } from '../../types'

describe('データ検証テスト', () => {
  describe('services.json', () => {
    it('正しい型定義に従っている', () => {
      expect(Array.isArray(servicesData)).toBe(true)
      
      servicesData.forEach((service: any, index) => {
        expect(service).toBeDefined()
        expect(typeof service.id).toBe('string')
        expect(typeof service.name).toBe('string')
        expect(typeof service.description).toBe('string')
        expect(typeof service.url).toBe('string')
        expect(Array.isArray(service.motiveTags)).toBe(true)
        expect(Array.isArray(service.jobTypeTags)).toBe(true)
        
        // 配列内の要素が文字列であることを確認
        service.motiveTags.forEach((tag: any) => {
          expect(typeof tag).toBe('string')
        })
        service.jobTypeTags.forEach((tag: any) => {
          expect(typeof tag).toBe('string')
        })
      })
    })

    it('必須フィールドが全て存在する', () => {
      const requiredFields = ['id', 'name', 'description', 'url', 'motiveTags', 'jobTypeTags']
      
      servicesData.forEach((service: any, index) => {
        requiredFields.forEach(field => {
          expect(service).toHaveProperty(field)
          expect(service[field]).not.toBeNull()
          expect(service[field]).not.toBeUndefined()
        })
      })
    })

    it('IDが一意である', () => {
      const ids = servicesData.map((service: any) => service.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('URLが有効な形式である', () => {
      const urlPattern = /^https?:\/\/.+/
      
      servicesData.forEach((service: any) => {
        expect(service.url).toMatch(urlPattern)
      })
    })

    it('空の配列や空文字列がない', () => {
      servicesData.forEach((service: any) => {
        expect(service.name.trim()).not.toBe('')
        expect(service.description.trim()).not.toBe('')
        expect(service.motiveTags.length).toBeGreaterThan(0)
        expect(service.jobTypeTags.length).toBeGreaterThan(0)
      })
    })

    it('最低限のサービス数が存在する', () => {
      expect(servicesData.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('tags.json', () => {
    it('正しい型定義に従っている', () => {
      expect(tagsData).toHaveProperty('motiveTags')
      expect(tagsData).toHaveProperty('jobTypeTags')
      expect(Array.isArray(tagsData.motiveTags)).toBe(true)
      expect(Array.isArray(tagsData.jobTypeTags)).toBe(true)
      
      const allTags = [...tagsData.motiveTags, ...tagsData.jobTypeTags]
      allTags.forEach((tag: any) => {
        expect(tag).toHaveProperty('id')
        expect(tag).toHaveProperty('label')
        expect(typeof tag.id).toBe('string')
        expect(typeof tag.label).toBe('string')
      })
    })

    it('タグIDが一意である', () => {
      const motiveIds = tagsData.motiveTags.map((tag: any) => tag.id)
      const jobTypeIds = tagsData.jobTypeTags.map((tag: any) => tag.id)
      const allIds = [...motiveIds, ...jobTypeIds]
      const uniqueIds = new Set(allIds)
      
      expect(uniqueIds.size).toBe(allIds.length)
    })

    it('空のラベルがない', () => {
      const allTags = [...tagsData.motiveTags, ...tagsData.jobTypeTags]
      allTags.forEach((tag: any) => {
        expect(tag.label.trim()).not.toBe('')
      })
    })

    it('最低限のタグ数が存在する', () => {
      expect(tagsData.motiveTags.length).toBeGreaterThanOrEqual(3)
      expect(tagsData.jobTypeTags.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('データの整合性', () => {
    it('servicesで使用されている全ての動機タグがtags.jsonに存在する', () => {
      const motiveTagIds = new Set(tagsData.motiveTags.map((tag: any) => tag.id))
      
      servicesData.forEach((service: any) => {
        service.motiveTags.forEach((tagId: string) => {
          expect(motiveTagIds.has(tagId)).toBe(true)
        })
      })
    })

    it('servicesで使用されている全ての職種タグがtags.jsonに存在する', () => {
      const jobTypeTagIds = new Set(tagsData.jobTypeTags.map((tag: any) => tag.id))
      
      servicesData.forEach((service: any) => {
        service.jobTypeTags.forEach((tagId: string) => {
          expect(jobTypeTagIds.has(tagId)).toBe(true)
        })
      })
    })

    it('tags.jsonの全ての動機タグが少なくとも1つのサービスで使用されている', () => {
      const usedMotiveTags = new Set()
      servicesData.forEach((service: any) => {
        service.motiveTags.forEach((tag: string) => {
          usedMotiveTags.add(tag)
        })
      })
      
      tagsData.motiveTags.forEach((tag: any) => {
        expect(usedMotiveTags.has(tag.id)).toBe(true)
      })
    })

    it('tags.jsonの全ての職種タグが少なくとも1つのサービスで使用されている', () => {
      const usedJobTypeTags = new Set()
      servicesData.forEach((service: any) => {
        service.jobTypeTags.forEach((tag: string) => {
          usedJobTypeTags.add(tag)
        })
      })
      
      tagsData.jobTypeTags.forEach((tag: any) => {
        expect(usedJobTypeTags.has(tag.id)).toBe(true)
      })
    })
  })

  describe('CLAUDE.mdで定義されたタグとの整合性', () => {
    const expectedMotiveTags = [
      'high_salary', 'remote_work', 'career_up', 'management',
      'change_domain', 'restart', 'stable_env', 'side_project'
    ]
    
    const expectedJobTypeTags = [
      'frontend', 'backend', 'mobile', 'infra',
      'pm', 'ml', 'generalist', 'unexp'
    ]

    it('CLAUDE.mdで定義された動機タグが全て存在する', () => {
      const actualMotiveTags = tagsData.motiveTags.map((tag: any) => tag.id)
      
      expectedMotiveTags.forEach(expectedTag => {
        expect(actualMotiveTags).toContain(expectedTag)
      })
    })

    it('CLAUDE.mdで定義された職種タグが全て存在する', () => {
      const actualJobTypeTags = tagsData.jobTypeTags.map((tag: any) => tag.id)
      
      expectedJobTypeTags.forEach(expectedTag => {
        expect(actualJobTypeTags).toContain(expectedTag)
      })
    })

    it('余分なタグが存在しない', () => {
      const actualMotiveTags = tagsData.motiveTags.map((tag: any) => tag.id)
      const actualJobTypeTags = tagsData.jobTypeTags.map((tag: any) => tag.id)
      
      expect(actualMotiveTags.sort()).toEqual(expectedMotiveTags.sort())
      expect(actualJobTypeTags.sort()).toEqual(expectedJobTypeTags.sort())
    })
  })

  describe('日本語ラベルの品質', () => {
    it('動機タグのラベルが適切な日本語である', () => {
      // Unicode範囲を使用してより広範囲の日本語文字をサポート
      const japanesePattern = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF0-9a-zA-Z\s・ー]+$/
      
      tagsData.motiveTags.forEach((tag: any) => {
        expect(tag.label).toMatch(japanesePattern)
        expect(tag.label.length).toBeGreaterThan(2)
        expect(tag.label.length).toBeLessThan(20)
      })
    })

    it('職種タグのラベルが適切な日本語である', () => {
      // Unicode範囲を使用してより広範囲の日本語文字をサポート
      const japanesePattern = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF0-9a-zA-Z\s・ー]+$/
      
      tagsData.jobTypeTags.forEach((tag: any) => {
        expect(tag.label).toMatch(japanesePattern)
        expect(tag.label.length).toBeGreaterThan(2)
        expect(tag.label.length).toBeLessThan(25)
      })
    })

    it('サービス名が適切な日本語である', () => {
      servicesData.forEach((service: any) => {
        expect(service.name.length).toBeGreaterThan(2)
        expect(service.name.length).toBeLessThan(50)
      })
    })

    it('サービス説明が適切な長さである', () => {
      servicesData.forEach((service: any) => {
        expect(service.description.length).toBeGreaterThan(10)
        expect(service.description.length).toBeLessThan(200)
      })
    })
  })
})